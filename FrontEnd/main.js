// Sélectionne l'élément HTML avec la classe "gallery" et le bouton de connexion avec l'ID "userLoginBtn"
const gallery = document.querySelector(".gallery");
const logBtn = document.getElementById('userLoginBtn');

// Effectue une requête GET vers l'API locale pour récupérer les données des projets
fetch('http://localhost:5678/api/works')
  .then(function(res) {
    // Vérifie si la requête a réussi (status 200 OK)
    if (res.ok) {
      // Convertit la réponse en format JSON
      return res.json();
    }
  })
  .then(function(data) {
    // Parcourt les données récupérées et crée du HTML pour chaque projet, puis l'ajoute à la galerie
    data.forEach((project) => {
      const projects = `<figure class='${project.categoryId}'>
        <img crossorigin="anonymous" src="${project.imageUrl}" alt="${project.title}">
        <figcaption>${project.title}</figcaption>
      </figure>`
      gallery.insertAdjacentHTML("beforeend", projects)
    });
  })
  .catch(function(err) {
    // Gère les erreurs en affichant un message dans la console
    console.error('Error:', err)
  });

// Sélectionne tous les boutons avec la classe "btn-filter" et ajoute un gestionnaire d'événements pour le clic
const buttons = document.querySelectorAll(".btn-filter")
buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    // Récupère l'ID du bouton cliqué et tous les éléments de figure
    const categorySelected = event.currentTarget.id;
    const categoriesArr = document.querySelectorAll('figure')
    // Applique le filtre aux catégories en fonction du bouton cliqué
    filterCategories(categorySelected, categoriesArr)
  })
})

// Fonction pour filtrer les catégories en fonction du bouton cliqué
const filterCategories = (categorySelected, categoriesArr) => {
  categoriesArr.forEach((e) => {
    if (categorySelected === 'all') {
      e.style.display = 'block'
    } else if (e.className === categorySelected) {
      e.style.display = 'block'
    } else {
      e.style.display = 'none'
    }
  })
}

// Exécute le code lorsque le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', function() {
  // Récupère le jeton d'utilisateur depuis le stockage local
  const userToken = localStorage.getItem('userToken');
  // Sélectionne à nouveau le bouton de connexion
  const logBtn = document.getElementById('userLoginBtn');
  // Sélectionne l'élément avec l'ID "edit"
  const navPortModif = document.getElementById('edit');

  // Ajoute un gestionnaire d'événements pour le clic sur le bouton de connexion
  logBtn.addEventListener('click', function() {
    // Supprime le jeton d'utilisateur du stockage local et redirige vers la page de connexion
    localStorage.removeItem('userToken');
    window.location.href = "login.html";
  });

  // Vérifie si l'utilisateur est connecté en fonction de la présence du jeton
  if (userToken) {
    console.log("Utilisateur connecté !");
    // Modifie le texte du bouton et affiche le bouton "modifier" en cas de connexion
    logBtn.innerHTML = "logout";
    navPortModif.style.display = 'block';
  } else {
    console.log("Utilisateur pas connecté !");
    // Modifie le texte du bouton et cache le bouton "modifier" en cas de déconnexion
    logBtn.textContent = "login";
    navPortModif.style.display = 'none';
  }
});
