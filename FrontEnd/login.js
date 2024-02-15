document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;



  fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
       
      },
      body: JSON.stringify({ email, password })
  })
  .then(response => {
      if (response.ok) {
          return response.json(); 
      } else {
          throw new Error('Authentification échouée');
      }
  })
  .then(data => {
    
      localStorage.setItem('userToken', data.token); 
      
    
      window.location.href = "index.html"; 
  })
  .catch(error => {
      alert("Authentification incorrecte", error);
  });
});