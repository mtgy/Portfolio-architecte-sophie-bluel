import { updateGallery } from "./main.js";

// Variable pour stocker la référence du modal actuellement ouvert
let modal = null;

// Référence à un élément HTML avec la classe "edit-projects"
const editProjects = document.querySelector(".edit-projects");

// Fonction pour afficher les projets
function displayProjectsToEdit() {
    // Requête Fetch pour récupérer les projets depuis l'API
    fetch('http://localhost:5678/api/works')
        .then(function(res) {
            // Vérifier si la réponse est OK
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(data) {
            // Effacer le contenu actuel de l'élément "editProjects"
            editProjects.innerHTML = '';

            // Parcourir les données et générer du HTML pour chaque projet
            data.forEach((project) => {
                const projects = `<div id="${project.id}" class="edit-project">
                    <img crossorigin="anonymous" src="${project.imageUrl}" alt="${project.title}">
                    <button class="btn-delete"><i id="${project.id}" class="fa-solid fa-trash-can"></i></button>
                </div>`;
                // Insérer le HTML généré à la fin de l'élément "edit-projects"
                editProjects.insertAdjacentHTML("beforeend", projects);
            });

            // Sélectionner les boutons de suppression et ajouter des écouteurs d'événements
            const buttonsToDelete = document.querySelectorAll(".btn-delete");
            addEventListeners(buttonsToDelete);
        })
        .catch(function(err) {
            // Gérer les erreurs de la requête Fetch
            console.error('Error:', err);
        });
}


// Fonction pour ajouter des écouteurs d'événements aux boutons de suppression
const addEventListeners = (buttonsToDelete) => {
    buttonsToDelete.forEach((button) => {
        button.addEventListener('click', (e) => {
            // Récupérer l'ID du projet à supprimer et appeler la fonction deleteProject
            const buttonId = e.target.id;
            deleteProject(buttonId);
        });
    });
}

// Fonction pour ouvrir un modal
const openModal = (e) => {
    e.preventDefault();
    // Récupérer la cible du modal à partir de l'attribut href de l'élément déclencheur
    const target = document.querySelector(e.target.getAttribute('href'));
    // Afficher le modal
    target.style.display = null;
    modal = target;

    // Ajouter des écouteurs d'événements pour fermer le modal
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    // Appeler la fonction displayProjectsToEdit pour afficher les projets
    displayProjectsToEdit();
}

// Fonction pour ouvrir un modal d'ajout de projet
const openAddModal = (e) => {
    // Cacher le modal actuellement ouvert
    modal.style.display = 'none';
    e.preventDefault();

    // Récupérer la cible du modal d'ajout
    const target = document.querySelector(e.target.getAttribute('href'));
    // Afficher le modal d'ajout
    target.style.display = null;
    modal = target;

    // Ajouter des écouteurs d'événements pour fermer le modal
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

// Fonction pour fermer le modal et actualiser la page
const closeModal = (e) => {
    // Vérifier si le modal est défini
    if (modal === null) return;
    e.preventDefault();

    // Cacher la modal
    modal.style.display = 'none';

    // Retirer les écouteurs d'événements pour fermer la modal
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    // Réinitialiser la variable modal à null
    modal = null;

    const form = document.getElementById('add-project');
    form.reset();
    // Efface l'aperçu de l'image dans le formulaire
    const parentDiv = document.querySelector(".parent-div");
    // Supprimer tous les enfants de parentDiv
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
    // Ajouter les éléments par défaut
    const defaultContent = '<img src="./assets/icons/picture.png" alt="picture" class="picture-icon">' +
                          '<button class="btn-upload">+ Ajouter photo</button>' +
                          '<input type="file" class="input-file" id="image" name="image" accept="image/*">' +
                          '<p class="format-image">jpg, png : 4mo max</p>';
    parentDiv.insertAdjacentHTML("beforeend", defaultContent);

   
}



// Fonction pour arrêter la propagation de l'événement
const stopPropagation = (e) => {
    e.stopPropagation();
}

// Fonction pour supprimer un projet
const deleteProject = (id) => {
    // Récupérer le token du localStorage
    const token = localStorage.getItem('userToken');

    // Requête Fetch pour supprimer le projet avec l'ID spécifié
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
        },
    })
        .then((res) => {
            if (res.ok) {
                // Afficher un message et supprimer l'élément du DOM
                console.log("Project deleted");
                document.getElementById(id).remove();
                // Actualiser l'affichage des projets
                displayProjectsToEdit();
                updateGallery();
            } else {
                console.log("Project not deleted");
            }
        })
        .catch((err) => console.log(err));
}

// Fonction pour ajouter un projet
const addProject = (e) => {
    e.preventDefault();
    // Récupérer le token du localStorage
    const token = localStorage.getItem('userToken');

    // Création d'un objet FormData pour envoyer les données du formulaire
    const formData = new FormData();
    formData.append('image', document.getElementById('image').files[0], document.getElementById('image').files[0].name);
    formData.append('title', document.querySelector('input[name="title"]').value);
    formData.append('category', document.querySelector('select[name="category"]').value);

   

    // Requête Fetch pour ajouter un nouveau projet
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    })
        .then(function(res) {
            if (res.ok) {
                closeModal(e);
                updateGallery();
                return res.json();
            }
        })
        .catch((err) => console.log(err));
}

// Sélection de l'élément d'entrée de type fichier et de l'élément parent
const file = document.querySelector("input[type='file']");
const parentDiv = document.querySelector(".parent-div");

// Écouteur d'événements pour le changement de fichier
file.addEventListener("change", (e) => {
    // Lire le fichier sélectionné avec FileReader
    let file = e.target.files[0];
    let reader = new FileReader();

    // Réaction lorsque la lecture est terminée
    reader.onload = function() {
        // Créer un nouvel élément image avec la source du fichier lu
        const newImg = document.createElement('img');
        newImg.src = reader.result;
        newImg.classList.add("img-target");

        // Masquer les éléments enfants de l'élément parent
        const children = parentDiv.children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.display = "none";
        }

        // Ajouter l'image au parent
        parentDiv.appendChild(newImg);
    }

    // Lire le contenu du fichier en tant que données URL
    reader.readAsDataURL(file);
});


// Écouteurs d'événements pour l'ouverture de modaux et l'ajout de projets
document.querySelector('.js-modal').addEventListener('click', openModal);
document.querySelector('.js-modal-add-project').addEventListener('click', openAddModal);
document.getElementById('add-project').addEventListener("submit", addProject);
