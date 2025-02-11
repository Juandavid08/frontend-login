import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        password: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleOpenModal = (user = null) => {
        setSelectedUser(user);
        setFormData(user || { nombre: "", apellido: "", correo: "", telefono: "", password: "" });
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (selectedUser) {
                await axios.patch(`http://localhost:8000/api/user/${selectedUser.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
            } else {
                await axios.post("http://localhost:8000/api/user", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire("Éxito", "Usuario creado correctamente", "success");
            }
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            Swal.fire("Error", "Hubo un problema al guardar el usuario", "error");
        }
    };

    const handleDeleteUser = async (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`http://localhost:8000/api/user/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
                    fetchUsers();
                } catch (error) {
                    Swal.fire("Error", "Hubo un problema al eliminar el usuario", "error");
                }
            }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "nombre", headerName: "Nombre", width: 180 },
        { field: "apellido", headerName: "Apellido", width: 180 },
        { field: "correo", headerName: "Correo", width: 270 },
        { field: "telefono", headerName: "Teléfono", width: 120 },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 300,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal(params.row)}
                        style={{ marginRight: "8px" }}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteUser(params.row.id)}
                    >
                        Eliminar
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Container>
            <Typography variant="h4" style={{ margin: "20px 0" }}>
                Usuarios
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenModal()} style={{ marginBottom: "10px" }}>
                Nuevo Usuario
            </Button>
            <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginLeft: "10px" }}>
                Cerrar Sesión
            </Button>
            <div style={{ height: 400, width: "100%", marginTop: "10px" }}>
                <DataGrid rows={users} columns={columns} pageSize={5} />
            </div>

            {/* Modal */}
            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>{selectedUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
                <DialogContent>
                    <TextField label="Nombre" name="nombre" fullWidth margin="dense" value={formData.nombre} onChange={handleChange} />
                    <TextField label="Apellido" name="apellido" fullWidth margin="dense" value={formData.apellido} onChange={handleChange} />
                    <TextField label="Correo" name="correo" fullWidth margin="dense" type="email" value={formData.correo} onChange={handleChange} />
                    <TextField label="Teléfono" name="telefono" fullWidth margin="dense" type="number" value={formData.telefono} onChange={handleChange} />
                    <TextField label="Contraseña" name="password" fullWidth margin="dense" type="password" value={formData.password} onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveUser} color="primary" variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserTable;
