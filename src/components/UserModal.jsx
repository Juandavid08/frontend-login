import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import Swal from "sweetalert2";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const UserModal = ({ user, closeModal }) => {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            setNombre(user.nombre);
            setCorreo(user.correo);
            setPassword("");
        } else {
            setNombre("");
            setCorreo("");
            setPassword("");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (user) {
                await axios.put(`http://localhost:8000/api/user/${user.id}`, { nombre, correo, password }, config);
                Swal.fire("¡Éxito!", "Usuario actualizado correctamente.", "success");
            } else {
                await axios.post("http://localhost:8000/api/user", { nombre, correo, password }, config);
                Swal.fire("¡Éxito!", "Usuario creado correctamente.", "success");
            }

            closeModal();
        } catch (error) {
            Swal.fire("Error", "Hubo un problema al guardar el usuario.", "error");
            console.error("Error al guardar usuario:", error);
        }
    };

    return (
        <Modal open={true} onClose={closeModal}>
            <Box sx={modalStyle}>
                <Typography variant="h6">{user ? "Editar Usuario" : "Nuevo Usuario"}</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required margin="normal" />
                    <TextField fullWidth type="email" label="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required margin="normal" />
                    <TextField fullWidth type="password" label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required={!user} margin="normal" />
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={closeModal}>
                            Cancelar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default UserModal;
