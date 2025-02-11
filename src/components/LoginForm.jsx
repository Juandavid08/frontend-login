import { useState } from "react";
import { TextField, Button, Container, Typography, CircularProgress, Box, Paper } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

const LoginForm = () => {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const response = await login({ correo, password });
    
            if (response?.data?.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
    
                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    showConfirmButton: false,
                    timer: 1500,
                });
    
                navigate("/users");
            } else {
                throw new Error("No se recibió un token válido");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error en el login";
            setError(errorMessage);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Iniciar Sesión
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Correo"
                        type="email"
                        variant="outlined"
                        margin="normal"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Box mt={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginForm;
