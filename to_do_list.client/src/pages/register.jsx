import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Register } from '../services/users/api';

function RegisterAplication() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try 
        {
            const data = await Register(email, name, password); 
            if(data.status === '200') {
                alert("Usuário cadastrado com sucesso");
                setEmail('');
                setPassword('');
                setName('');
                navigate("/");
            }
            else if (data.status === '409') {
                alert("Usuário ja cadastrado");
                setEmail('');
                setPassword('');
                setName('');
                return;
            }
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
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex flex-row align-items-center text-align-center justify-content-center">
                                <p className="lead fw-normal mb-2 me-2">Realize o seu Cadastro</p>
                            </div>

                            {error && <p className="text-danger">{error}</p>}
                            
                            <div className='form-outline mb-2 col-8 mx-auto'>
                                <label className="form-label" htmlFor="name">Nome</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="form-control form-control-sm" 
                                    placeholder="Insira o seu Nome" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-outline mb-2 col-8 mx-auto">
                                <label className="form-label" htmlFor="email">E-mail</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className="form-control form-control-sm" 
                                    placeholder="Insira o seu E-mail" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            
                            <div className="form-outline mb-2 col-8 mx-auto">
                                <label className="form-label" htmlFor="password">Senha</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    className="form-control form-control-sm" 
                                    placeholder="Insira a sua senha" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-outline mb-4 col-8 mx-auto">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-md btn-css w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Cadastrando..." : "Cadastrar"}
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-2 text-center">
                                    Possui uma conta? <a href='/' className="link-danger">Entrar</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default RegisterAplication;