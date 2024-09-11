document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    // Cargar datos del usuario
    fetch(`/usuarios/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('apellido').value = user.apellido;
            document.getElementById('telefono').value = user.telefono;
            document.getElementById('correo').value = user.correo;
            document.getElementById('username').value = user.username;
            document.getElementById('rol').value = user.rol_id;
            document.getElementById('estado').value = user.estado_id;
        })
        .catch(error => console.error('Error al cargar usuario:', error));

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

    // Manejar el formulario de edición de usuario
    document.getElementById('editUserForm').addEventListener('submit', function (event) {
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

        fetch(`/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Usuario actualizado exitosamente');
                window.location.href = 'gestion.html';
            } else {
                alert('Hubo un problema al actualizar el usuario');
            }
        })
        .catch(error => console.error('Error al actualizar usuario:', error));
    });
});
