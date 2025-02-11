import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8000/api";
const token = localStorage.getItem("token");

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
};

// 👉 Iniciar sesión (POST)
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials, {
            validateStatus: (status) => status >= 200 && status < 300, // Asegurar que Axios lo trate como éxito
        });

        console.log("Respuesta del servidor:", response.data); // Depuración

        return response; // Retorna la respuesta completa
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Lanza el error para que el componente lo maneje
    }
};


// 👉 Cerrar sesión (POST)
export const logout = async (onSuccess) => {
    try {
        await axios.post(`${API_URL}/logout`, {}, { headers });
        localStorage.removeItem("token"); // Eliminar token
        Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente", "info");
        if (onSuccess) onSuccess();
    } catch (error) {
        Swal.fire("Error", "No se pudo cerrar sesión", "error");
    }
};

// 👉 Obtener lista de usuarios (GET)
export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`, { headers });
        return response.data.data;
    } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        return [];
    }
};

// 👉 Obtener un usuario por ID (GET)
export const getUserById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/user/${id}`, { headers });
        return response.data;
    } catch (error) {
        Swal.fire("Error", "No se pudo cargar el usuario", "error");
        return null;
    }
};

// 👉 Crear usuario (POST)
export const createUser = async (userData, onSuccess) => {
    try {
        await axios.post(`${API_URL}/user`, userData, { headers });
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
        if (onSuccess) onSuccess(); // Recargar la lista
    } catch (error) {
        Swal.fire("Error", "No se pudo crear el usuario", "error");
    }
};

// 👉 Actualizar usuario (PATCH)
export const updateUser = async (id, userData, onSuccess) => {
    try {
        await axios.patch(`${API_URL}/user/${id}`, userData, { headers });
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
        if (onSuccess) onSuccess(); // Recargar la lista
    } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
};

// 👉 Eliminar usuario (DELETE)
export const deleteUser = async (id, onSuccess) => {
    try {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            await axios.delete(`${API_URL}/user/${id}`, { headers });
            Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
            if (onSuccess) onSuccess(); // Recargar la lista
        }
    } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
    }
};
