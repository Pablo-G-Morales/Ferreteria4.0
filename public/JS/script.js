document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.rol === 'admin') {
                window.location.href = 'gestion.html'; // Redirigir a gestion.html si es admin
            } else if (data.rol === 'usuario') {
                window.location.href = 'dashboard.html'; // Redirigir a dashboard.html si es usuario
            }
        } else {
            // Mostrar mensaje de error en la página de login
            document.getElementById('errorMsg').textContent = data.message;
        }
    })
    .catch(error => console.error('Error al iniciar sesión:', error));
});
