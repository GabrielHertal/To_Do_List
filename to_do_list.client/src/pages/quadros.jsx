import { useEffect, useState } from "react";
import { Table, Button, Form, Pagination, Modal } from "react-bootstrap";
import { CreateQuadro, GetQuadroById, GetQuadrosByUserId, UpdateQuadroById, DeleteQuadro,
         CreateCodigoConvite, GetQuadroByOwnerId, VinculaCodigoConviteQuadro, GetMembrosQuadro, VinculaQuadroUser, DesvinculaQuadroUser } from "../services/quadros/api";
const Quadros = () => {
    const [myquadros, setMyQuadros] = useState([]); // Lista de usuários
    const [participaquadros, setMyQuadrosParticipante] = useState([]); // Lista de usuários
    const [showModal, setShowModal] = useState(false); // Controle do modal
    const [showModalConvite, setShowModalConvite] = useState(false);
    const [membrosquadro, setMembrosQuadro] = useState({ id_user: "", nome_user: "", id_owner : "", id_quadro : "" }); // Novo usuário
    const [showModalIngressaQuadro, setShowModalIngressaQuadro] = useState(false);
    const [showModalMembrosQuadro, setShowModalMembrosQuadro] = useState(false);
    const [newConvite, setNewConvite] = useState({ codigo: "", tipo: "" }); // Novo convite
    const [newQuadro, setNewQuadro] = useState({ id: "", nome: "" }); // Novo usuário
    const [currentPage, setCurrentPage] = useState(1); // Página atual
    const totalPages = Math.ceil(myquadros.length / 10); // Assuming 10 users per page
    // Carregar usuários da API
    const fetchQuadrosOwner = async () => {
        try {
            const res = await GetQuadroByOwnerId(localStorage.getItem("UserID"));
            if (res && Array.isArray(res.data)) {
                setMyQuadros(res.data);
            } else {
                setMyQuadros([]);
                console.error("Erro: a API não retornou um array válido.");
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setMyQuadros([]);
        }
    };
    const fetchQuadrosParticipante = async () => {
        try {
            const res = await GetQuadrosByUserId(localStorage.getItem("UserID"));
            if (res && Array.isArray(res.data)) {
                setMyQuadrosParticipante(res.data);
            } else {
                setMyQuadrosParticipante([]);
                console.error("Erro: a API não retornou um array válido.");
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setMyQuadrosParticipante([]);
        }
    };
    useEffect(() => {
        fetchQuadrosParticipante();
        fetchQuadrosOwner();
    }, []);
    // Criar novo usuário
    const handleCreateQuadro = async () => {
        try {
            if(newQuadro.name === "") {
                alert("Preencha o nome do quadro");
                return;
            }
            const data = await CreateQuadro(newQuadro.nome, localStorage.getItem("UserID"));
            if (data.status === 200) {
                alert("Quadro cadastrado com sucesso");
                setShowModal(false);
                fetchQuadrosOwner();
            } else if (data.status === '409') {
                setNewQuadro({ nome: ""});
                alert("Quadro já cadastrado");
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Editar quadro
    const handleEditQuadro = async (id) => {
        try{
            const quadroToEdit = await GetQuadroById(id);
            setNewQuadro({ id: quadroToEdit.data.id, nome: quadroToEdit.data.nome});
            setShowModal(true);
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
    };
    // Atualizar quadro
    const handleUpdateQuadro = async () => {
        try {
            const data = await UpdateQuadroById(newQuadro.id, newQuadro.nome);
            if (data.status === 200) {
                setShowModal(false);
                fetchQuadrosOwner();
            } else if (data.status === 409) {
                setNewQuadro({ nome: ""});
                alert("Quadro já cadastrado");
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Deletar usuário
    const handleDeleteQuadro = async (id) => {
        try {
            const data = await DeleteQuadro(id);
            if (data.status === 404) {
                alert(data.Message);               
                return;
            } else if (data.status === 409) {
                alert(data.Message);               
                return;
            }
            if (data.status === 200) {
                alert("Quadro deletado com sucesso");           
                fetchQuadrosOwner();     
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Gera Código de Convite
    const handleGeraCodigoConvite = async (id) => {
        try {
            const data = await CreateCodigoConvite(6);
            if (data.status === 200) {
                setNewConvite({ codigo: data.data });
                setNewQuadro({ id: id });
                setShowModalConvite(true);       
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Vincula Código de Convite ao Quadro
    const handleVinculaCodigoConviteQuadro = async () => {
        try {
            const data = await VinculaCodigoConviteQuadro(newQuadro.id, newConvite.codigo);
            if (data.status === 200) {
                setShowModalConvite(false);
                alert("Código vinculado com sucesso");
                setNewConvite({ codigo: "" });
                setNewQuadro({ id: "" });
                fetchQuadrosOwner();
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };
    // Visualiza Código de Convite
    const handleVisualizaCodigoConvite = async (id) => {
        try {
            // Encontrar o quadro pelo ID
            const quadroSelecionado = (myquadros && myquadros.find((quadro) => quadro.id === id)) 
                || (participaquadros && participaquadros.find((quadro) => quadro.id === id));
            if (quadroSelecionado) {
                setNewConvite({ codigo: quadroSelecionado.codigo_Convite, tipo: "visualiza" });
                setShowModalConvite(true);
                if(!quadroSelecionado.codigo_Convite){
                    alert("Código de convite não encontrado!");
                    return;
                }
            } else {
                console.log("Quadro não encontrado!");
                alert("Quadro não encontrado!");
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };
    // Visualiza Membros do Quadro
    const handleVisualizaMembrosQuadro = async (id) => {
        try {
            const data = await GetMembrosQuadro(id);
            if (data && Array.isArray(data.data)) {
                setMembrosQuadro(data.data);
            } else {
                setMembrosQuadro([]);
                console.error("Erro: a API não retornou um array válido.");
            }
            setShowModalMembrosQuadro(true);
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
    };
    // Ingressar em Quadro
    const handleIngressarQuadro = async (convite) => {
        try{
            const data = await VinculaQuadroUser(convite, localStorage.getItem("UserID"));
            if(data.status == 404){
                alert("Quadro não encontrado!");
                return;
            }else if(data.status == 409){
                alert("Você já participa deste quadro!");
                return;
            }
            setShowModalIngressaQuadro(false);
            setNewConvite({ codigo: "" });
            setNewQuadro({ id: "" });
            fetchQuadrosParticipante();
        }
        catch(error){
            console.log(error);
            alert(error);   
        }
    };
    // Participante sair do quadro
    const handleDesvinculaUserQuadro = async (id) => {
        try{
            const data = await DesvinculaQuadroUser(id, localStorage.getItem("UserID"));
            if(data.status == 404){
                alert("Quadro não encontrado!");
                return;
            }
            fetchQuadrosParticipante();
            setShowModalMembrosQuadro(false);
            setMembrosQuadro({ id: "", nome: "" });
        }
        catch(error){
            console.log(error);
            alert(error);   
        }
    };
    // Remover Usuário do Quadro
    const handleRemoverUserQuadro = async (id_quadro, id_user, id_owner) => {
        try{
            if(id_owner == localStorage.getItem("UserID")){
                handleDeleteQuadro(id_quadro);
            }   
            if(id_user == id_owner){
                alert("Você não pode remover o dono do quadro!");
                return;
            }
            const data = await DesvinculaQuadroUser(id_quadro, id_user);
            if(data.status == 404){
                alert("Quadro não encontrado!");
                return;
            }
            fetchQuadrosParticipante();
            setShowModalMembrosQuadro(false);
            setMembrosQuadro({ id: "", nome: "" });
            handleVisualizaMembrosQuadro(id_quadro);
        }
        catch(error){
            console.log(error);
            alert(error);   
        }
    };
    return (
        // Renderização do componente Quadros 
        <div className="container mt-4">
            <h3 className="text-center">Meus Quadros</h3>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    + Criar Quadro
                </Button>
            </div>
            {/* Tabela de Usuários */}
            <Table striped bordered hover>
                <thead className="text-center">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {myquadros.length > 0 ? (
                        myquadros.slice((currentPage - 1) * 10, currentPage * 10).map((quadro) => (
                            <tr key={quadro.id}>
                                <td>{quadro.id}</td>
                                <td>{quadro.nome}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleVisualizaMembrosQuadro(quadro.id)}>
                                        Visualizar Membros
                                    </Button>
                                    {quadro.codigo_Convite ? (
                                        <Button variant="info" onClick={() => handleVisualizaCodigoConvite(quadro.id)}>
                                            Visualizar Código de Convite
                                        </Button>
                                    ) : (
                                        <Button variant="success" onClick={() => handleGeraCodigoConvite(quadro.id)}>
                                            Gerar Código de Convite 
                                        </Button>
                                    )}
                                    <Button variant="warning" onClick={() => handleEditQuadro(quadro.id)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger " onClick={() => handleDeleteQuadro(quadro.id)}>
                                        Deletar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                Não há quadros criados por este usuário.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
             {/* Quadros em que o usuário esta vinculado  */}
            <h3 className="text-center">Quadros Participante</h3>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={() => setShowModalIngressaQuadro(true)}>
                    + Ingressar em Quadro
                </Button>
            </div>
            {/* Tabela de Usuários */}
            <Table striped bordered hover>
                <thead className="text-center">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {participaquadros.length > 0 ? (
                        participaquadros.slice((currentPage - 1) * 10, currentPage * 10).map((participaquadro) => (
                            <tr key={participaquadro.id}>
                                <td>{participaquadro.id}</td>
                                <td>{participaquadro.nome}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleVisualizaMembrosQuadro(participaquadro.id)}>
                                        Visualizar Membros
                                    </Button>
                                    {participaquadro.codigo_Convite ? (
                                        <Button variant="info" onClick={() => handleVisualizaCodigoConvite(participaquadro.id)}>
                                            Visualizar Código de Convite
                                        </Button>
                                    ) : (
                                        <Button variant="success" onClick={() => handleGeraCodigoConvite(participaquadro.id)}>
                                            Gerar Código de Convite
                                        </Button>
                                    )}
                                    <Button variant="danger" onClick={() => handleDesvinculaUserQuadro(participaquadro.id)}>
                                        Sair do Quadro
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                Este usuário não participa de nenhum quadro.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {/* Paginação */}
            {myquadros.length > 0 && (
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
            )}
            {/* Modal de Cadastro */}
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setNewQuadro({ id: "",nome: "" });
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{newQuadro.id ? "Editar Quadro" : "Criar Novo Quadro"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={newQuadro.nome}
                                onChange={(e) => setNewQuadro({ ...newQuadro, nome: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowModal(false);
                            setNewQuadro({ id: "",nome: "" });
                        }}
                    >
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={newQuadro.id ? handleUpdateQuadro : handleCreateQuadro}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal de para visulizar código gerado */}
            <Modal 
                show={showModalConvite} 
                onHide={() =>{ 
                    setShowModalConvite(false)
                    setNewConvite({ codigo: "" });
                    setNewQuadro({ id: "" });
                }}
                >
                <Modal.Header closeButton>
                    <Modal.Title>Convite Gerado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Convite</Form.Label>
                        {newConvite.tipo == "visualiza" ? (
                            <Form.Control 
                                type="text" 
                                value={newConvite.codigo} readOnly 
                            />
                        ) : (
                            <Form.Control 
                                type="text" 
                                value={newConvite.codigo} 
                                onChange={(e) => setNewConvite({ ...newConvite, codigo: e.target.value })} 
                            />
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => {
                            setShowModalConvite(false);
                            setNewConvite({ codigo: "" });
                            setNewQuadro({ id: "" });
                        }}
                    >
                        Fechar
                    </Button>
                    {newConvite.tipo === "visualiza" ? null : (
                        <Button 
                            id="vincular" 
                            variant="primary" 
                            onClick={() => handleVinculaCodigoConviteQuadro(false)}
                        >
                            Vincular ao Quadro
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            {/* Modal de para ingressar em um quadro */}
            <Modal 
                show={showModalIngressaQuadro} 
                onHide={() =>{ 
                    setShowModalIngressaQuadro(false)
                    setNewConvite({ codigo: "" });
                }}
                >
                <Modal.Header closeButton>
                    <Modal.Title>Ingressar em um Quadro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Convite</Form.Label>
                        <Form.Control type="text" 
                            value={newConvite.codigo}
                            onChange={(e) => setNewConvite({ ...newConvite, codigo: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalIngressaQuadro(false)}>
                        Fechar
                    </Button>
                    <Button id="vincular" variant="primary" onClick={() => handleIngressarQuadro(newConvite.codigo)}>
                        Buscar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal de para visualizar os membros do quadro */}
            <Modal 
                show = {showModalMembrosQuadro} 
                onHide = {() =>{ 
                    setShowModalMembrosQuadro(false)
                    setMembrosQuadro({id: "", nome: ""});
                }}
                >
                <Modal.Header closeButton>
                    <Modal.Title>Membros do Quadro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuário</th>
                                <th>Remover</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(membrosquadro) ? (
                                membrosquadro.map((membro) => (
                                    <tr key={membro.id_user}>
                                        <td>{membro.id_user}</td>
                                        <td>
                                            {membro.nome_user}
                                            {membro.id_owner == membro.id_user ? " (Dono)" : ""}
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoverUserQuadro(membro.id_quadro,membro.id_user, membro.id_owner)}>
                                                <i className="bi bi-trash"></i>  {/* Ícone de lixeira */}
                                                Remover
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">Nenhum membro encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalMembrosQuadro(false)}>
                        Fechar  
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default Quadros;''