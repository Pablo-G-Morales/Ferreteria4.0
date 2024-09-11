document.addEventListener('DOMContentLoaded', function () {
    // Obtener roles
    fetch('/roles')
        .then(response => response.json())
        .then(data => {
            const rolSelect = document.getElementById('rol');
            data.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.id;
                option.textContent = rol.nombre;
                rolSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar roles:', error));

    // Obtener estados
    fetch('/estados')
        .then(response => response.json())
        .then(data => {
            const estadoSelect = document.getElementById('estado');
            data.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.id;
                option.textContent = estado.nombre;
                estadoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar estados:', error));

    // Manejar el formulario de creación de usuario
    document.getElementById('createUserForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = new FormData(this);
        const userData = {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            telefono: formData.get('telefono'),
            correo: formData.get('correo'),
            username: formData.get('username'),
            password: formData.get('password'),
            rol: formData.get('rol'),
            estado: formData.get('estado')
        };

        fetch('/crear-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Usuario creado exitosamente');
                window.location.href = 'gestion.html';
            } else {
                alert('Hubo un problema al crear el usuario');
            }
        })
        .catch(error => console.error('Error al crear usuario:', error));
    });
});
