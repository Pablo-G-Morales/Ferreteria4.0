document.addEventListener('DOMContentLoaded', function () {
    const userTableBody = document.getElementById('userTableBody');

    // Cargar los usuarios desde la base de datos
    function loadUsers() {
        fetch('/usuarios')
            .then(response => response.json())
            .then(data => {
                userTableBody.innerHTML = '';
                data.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.nombre}</td>
                        <td>${user.apellido}</td>
                        <td>${user.telefono}</td>
                        <td>${user.correo}</td>
                        <td>${user.username}</td>
                        <td>${user.estado_nombre}</td>
                        <td>${user.rol_nombre}</td>
                        <td>
                            <button class="editBtn" data-id="${user.id}">Editar</button>

                        </td>
                    `;
                    userTableBody.appendChild(row);
                });

                // Añadir manejadores de eventos para botones de edición y eliminación
                document.querySelectorAll('.editBtn').forEach(button => {
                    button.addEventListener('click', function () {
                        const userId = this.getAttribute('data-id');
                        window.location.href = `editar-usuario.html?id=${userId}`;
                    });
                });

                document.querySelectorAll('.deleteBtn').forEach(button => {
                    button.addEventListener('click', function () {
                        const userId = this.getAttribute('data-id');
                        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                            deleteUser(userId);
                        }
                    });
                });
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    }

    // Eliminar un usuario
    function deleteUser(id) {
        fetch(`/user/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Usuario eliminado exitosamente');
                loadUsers(); // Recargar la lista de usuarios
            } else {
                alert('Hubo un problema al eliminar el usuario');
            }
        })
        .catch(error => console.error('Error al eliminar usuario:', error));
    }

    // Manejar el botón de crear nuevo usuario
    document.getElementById('createUserBtn').addEventListener('click', function () {
        window.location.href = 'crear-usuario.html';
    });

    // Manejar el botón de cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', function () {
        window.location.href = 'index.html'; // O la página de inicio de sesión
    });

    // Manejar el botón de avanzar al dashboard
    document.getElementById('goToDashboardBtn').addEventListener('click', function () {
        window.location.href = 'dashboard.html';
    });

    // Cargar los usuarios al iniciar la página
    loadUsers();
});
