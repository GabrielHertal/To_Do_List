import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import { GetUserInformation } from "../services/security/api";
import Users from "./users";
import Tarefas from "./tarefas";
import Quadros from "./quadros";

function Home() {
    const navigate = useNavigate();
    const [ UserName, setUserName ] = useState("User");
    const handleLogout = async () => {
        confirm("Deseja realmente sair?");
        if(confirm){
            localStorage.removeItem("AuthToken");
            localStorage.removeItem("UserID");
            localStorage.removeItem("UserName");
            navigate("/login");
        }
    }
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("AuthToken");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await GetUserInformation(token);
            if(response.statusCode === 401){
                localStorage.removeItem("AuthToken");
                localStorage.removeItem("UserID");
                localStorage.removeItem("UserName");
                navigate("/login");
            }
            else {
                setUserName(response.name);
                localStorage.setItem("UserID", response.id);
            }
        }
        fetchUserInfo();
        const handleUserNameUpdate = () => {
            setUserName(localStorage.getItem("UserName") || "User");
        };

        window.addEventListener("userNameUpdated", handleUserNameUpdate);

        return () => {
            window.removeEventListener("userNameUpdated", handleUserNameUpdate);
        };
    }, [navigate]);

    const [content, setContent] = useState();

    const handleNavigation = (path) => {
        if (path === "/users") {
            setContent(<Users />);
        } 
        else if (path === "/tarefas") {
            setContent(<Tarefas />);
        }
        else if (path === "/quadros") {
            setContent(<Quadros />);
        }
        else if (path === "/") {
            setContent("Tela Inicial!");
        }
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <a href="#" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 d-none d-sm-inline">To Do List</span>
                        </a>    
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-center" id="menu">
                            <li className="nav-item">
                                <a href="#" className="nav-link align-middle px-0" onClick={() => handleNavigation("/")}>
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link px-0 align-middle" onClick={() => handleNavigation("/tarefas")}>
                                    <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Tarefas</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link px-0 align-middle" onClick={() => handleNavigation("/users")}>
                                    <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Usuários</span> 
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link px-0 align-middle" onClick={() => handleNavigation("/quadros")}>
                                    <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Quadros</span> 
                                </a>
                            </li>
                        </ul>
                        <hr />
                        <div className="dropdown pb-4">
                            <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="d-none d-sm-inline mx-1">{UserName}</span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                                <li><a className="dropdown-item" onClick={handleLogout}>Sair</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col py-3">
                    {content}
                </div>
            </div>
        </div>
    );
}

export default Home;