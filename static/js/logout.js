const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
    // Enviar una solicitud para cerrar la sesión al servidor
    fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include"
    })
    .then(response => {
        if (response.status === 200) {
            window.location.href = "login.html";
        } else if (response.status === 401) {
            // El usuario no estaba autenticado
            window.location.href = "login.html";
        } else {
            // Manejar otros posibles códigos de estado de respuesta
            console.error("Error en el cierre de sesión. Código de estado:", response.status);
        }
    })
    .catch(error => {
        console.error("Error en el cierre de sesión:", error);
    });
});
