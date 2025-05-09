import { useEffect, useState } from "react";
import { Table, Button, Form, Pagination, Modal } from "react-bootstrap";
import { GetUsers, Register, GetUserById, DeleteUser, UpdateUserById } from "../services/users/api";
const Usuários = () => {
    const [users, setUsers] = useState([]); // Lista de usuários
    const [showModal, setShowModal] = useState(false); // Controle do modal
    const [newUser, setNewUser] = useState({ name: "", email: "", password : "" }); // Novo usuário
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(users.length / 10); // Assuming 10 users per page

    // Carregar usuários da API
    const fetchUsers = async () => {
        try {
            const res = await GetUsers();
            if (res && Array.isArray(res.data)) {
                setUsers(res.data);
            } else {
                setUsers([]);
                console.error("Erro: a API não retornou um array válido.");
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setUsers([]);
        }
    };    

    // Carregar usuários ao montar o componente
    useEffect(() => {
        fetchUsers();
    }, []);

    // Criar novo usuário
    const handleCreateUser = async () => {
        try {
            if(newUser.name === "" || newUser.email === "" || newUser.password === "") {
                alert("Preencha todos os campos");
                return;
            }
            const data = await Register(newUser.email, newUser.name, newUser.password);
            if (data.status === '200') {
                alert("Usuário cadastrado com sucesso");
                setShowModal(false);
                fetchUsers();
            } else if (data.status === '409') {
                setNewUser({ name: "", email: "", password: "" });
                alert("Usuário já cadastrado");
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Editar usuário
    const handleEditUser = async (id) => {
        try{
            const userToEdit = await GetUserById(id);
            setNewUser({ id: userToEdit.data.id, name: userToEdit.data.nome, email: userToEdit.data.email });
            setShowModal(true);
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const data = await UpdateUserById(newUser.id, newUser.email, newUser.name, newUser.password);
            if (data.status === 200) {
                setShowModal(false);
                fetchUsers();
                
                const loggedUserId = localStorage.getItem("UserID");
                if (loggedUserId && parseInt(loggedUserId) === newUser.id) {
                    localStorage.setItem("UserName", newUser.name);
                    window.dispatchEvent(new Event("userNameUpdated"));
                }
            } else if (data.status === '409') {
                setNewUser({ name: "", email: "", password: "" });
                alert("Usuário já cadastrado");
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Deletar usuário
    const handleDeleteUser = async (id) => {
        try {
            const data = await DeleteUser(id);
            if (data.status === 200) {
                alert("Usuário deletado com sucesso");           
                fetchUsers();     
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Usuários</h1>
            <div className="d-flex justify-content-between mb-3">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    + Criar Usuário
                </Button>
            </div>

            {/* Tabela de Usuários */}
            <Table striped bordered hover>
                <thead className="text-center">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {users.slice((currentPage - 1) * 10, currentPage * 10).map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditUser(user.id)}>
                                    Editar
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                                    Deletar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginação */}
            <Pagination>
                {[...Array(totalPages).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => setCurrentPage(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {/* Modal de Cadastro */}
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setNewUser({ name: "", email: "", password: "" });
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{newUser.id ? "Editar Usuário" : "Criar Novo Usuário"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowModal(false);
                            setNewUser({ name: "", email: "", password: "" });
                        }}
                    >
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={newUser.id ? handleUpdateUser : handleCreateUser}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Usuários;
