document.getElementById("login-form").addEventListener("submit", function(event) {
    // Prevenir el envío predeterminado del formulario.
    event.preventDefault();
    
    // Obtener el valores
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const errorMessage = document.getElementById("error-message");
    
    // Realizar una solicitud HTTP POST al servidor
    fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json()) // Analizar la respuesta JSON del servidor
    .then(data => {
        // Verificar si la respuesta contiene un error
        if (data.error) {
            errorMessage.textContent = data.error; 
        } else {
            // Si no hay error, redirigir al usuario a la página "dashboard.html"
            window.location.href = "dashboard.html";
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
