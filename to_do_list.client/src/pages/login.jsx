import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/Login.css";
import { login } from "../services/api"; // Corrigido

function LoginAplication() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await login(email, password); // Chama a API corretamente
            if(data.status === 401) {
                alert("Usuário ou senha inválidos");
                return;
            }
            localStorage.setItem("AuthToken", data.token);
            navigate("/home"); // Redireciona após o login
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="vh-100" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="img-fluid" alt="Sample image" />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex flex-row align-items-center text-align-center justify-content-center">
                                <p className="lead fw-normal mb-2 me-2">Entre com a sua conta</p>
                            </div>
                            
                            {error && <p className="text-danger">{error}</p>}
                            
                            <div className="form-outline mb-2">
                                <label className="form-label" htmlFor="email">E-mail</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className="form-control form-control-md" 
                                    placeholder="Insira o seu E-mail" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            
                            <div className="form-outline mb-2">
                                <label className="form-label" htmlFor="password">Senha</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    className="form-control form-control-md" 
                                    placeholder="Informe a sua senha" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-md btn-css"
                                    disabled={loading}
                                >
                                    {loading ? "Entrando..." : "Entrar"}
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-0">
                                    Não possui uma conta? <a href="/register" className="link-danger">Registre-se</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default LoginAplication;