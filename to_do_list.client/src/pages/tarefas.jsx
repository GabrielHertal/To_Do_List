import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Button } from "react-bootstrap";
import { CreateTarefa, GetTarefaByQuadroId, GetTarefaById, UpdateTarefa, UpdateStatusTarefa, DeleteTarefa, AlteraTarefaQuadro } from "../services/tarefas/api";
import { GetQuadrosTarefaByIdUser } from "../services/quadros/api";

const Tarefas = () => {
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [showModalAlteraQuadro, setShowModalAlteraQuadro] = useState(false);
  const [NewTarefa, setNewTarefa] = useState({ id: "", titulo: "", descricao: "", status: "", nota: "" }); // Nova Tarefa
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [selectedDroppableId, setSelectedDroppableId] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState({ id: "", name: "" });
  const [TarefaQuadro, setTarefaQuadro] = useState({id_tarefa: "", id_quadro_destino: "" });
  const [boards, setBoards] = useState([]);
  const userid = localStorage.getItem("UserID");

  const fetchQuadros = React.useCallback(async () => {
    try {
      const res = await GetQuadrosTarefaByIdUser(userid);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setBoards(res.data);
        setSelectedBoard(res.data[-1]);
      } else {
        setBoards([]);
        setSelectedBoard(null);
        alert("Erro: a API nao retornou um array valido.");
        console.error("Erro: a API nao retornou um array valido.");
      }
    } catch (error) {
      console.error(error);
    }
  }, [userid]);
  const handleEditTarefa = async (id) => {
    try {
      const data = await GetTarefaById(id);
      setNewTarefa({ id: data.data.id, titulo: data.data.titulo, descricao: data.data.descricao, status: data.data.status, nota: data.data.nota });
      setShowModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
  const handleUpdateTarefa = async () => {
    try {
      if (!NewTarefa.titulo || !NewTarefa.descricao) {
        alert("Preencha título e descrição.");
        return;
      }
      const data = await UpdateTarefa(NewTarefa.id, NewTarefa.titulo, NewTarefa.descricao, userid, NewTarefa.status, NewTarefa.nota);
      console.log(data);
      if (data.status === 200) {
        setShowModal(false);
        fechTarefasByQuadroId(selectedBoard.id);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
  const fechTarefasByQuadroId = async (quadroId) => {
    if(!quadroId) return;
    try {
      const response = await GetTarefaByQuadroId(quadroId);
      const tarefas = response.data;
      if (Array.isArray(tarefas)) {
        const toDo = tarefas.filter(task => task.status === '0');
        const inProgress = tarefas.filter(task => task.status === '1');
        const done = tarefas.filter(task => task.status === '2');
        setToDoTasks(toDo);
        setInProgressTasks(inProgress);
        setDoneTasks(done);
      } else {
        console.error("Erro: a API nao retornou um array valido.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (selectedBoard && selectedBoard.id) {
      fechTarefasByQuadroId(selectedBoard.id);
    }
  }, [selectedBoard]);
  useEffect(() => {
   fetchQuadros();
  }, [fetchQuadros]);
  const handleCreateTarefa = async () => {
    try {
      if (!NewTarefa.titulo || !NewTarefa.descricao) {
        alert("Preencha título e descrição.");
        return;
      }
      const data = await CreateTarefa(NewTarefa.titulo, NewTarefa.descricao, null , userid, selectedDroppableId, NewTarefa.nota, selectedBoard.id);
      if (data.status === 200) {
        alert("Tarefa cadastrado com sucesso");
        setNewTarefa({ id:"", titulo: "", descricao: "", userId: "", status: "", nota: "" });
        setShowModal(false);
        fechTarefasByQuadroId(selectedBoard.id); 
      } else if (data.status === 409) {
        setNewTarefa({ id:"", titulo: "", descricao: "", userId: "", status: "", nota:"" });
        alert("Tarefa já cadastrado");
        return;
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  const handleUpdateStatusTarefa = async (id, status) => {
    try {
      const data = await UpdateStatusTarefa(id, status);
      if (data.status === 200) {
        fechTarefasByQuadroId(selectedBoard.id);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeleteTarefa = async (id) => {
    try {
      const data = await DeleteTarefa(id);
      if (data.status === 200) {
        alert(data.data.message);
        fechTarefasByQuadroId(selectedBoard.id); 
      } else if (data.status === 409) {
        alert("Erro ao deletar tarefa");
        return;
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }
  const handleAlteraQuadroTarefa = async (id) => {
    try{
      const data = await AlteraTarefaQuadro(id, TarefaQuadro.id_quadro_destino);
      console.log(data);
      if (data.status === 200) {
        alert(data.data.message);
        setShowModalAlteraQuadro(false);
        fechTarefasByQuadroId(selectedBoard.id); 
      } else if (data.status === 409) {
        alert("Erro ao alterar quadro da tarefa");
        return;
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }
  const onDragEnd = (result) => {
    if (!result.destination) return; // Se não houver destino, não faz nada  
    const sourceList = getList(result.source.droppableId);
    const destinationList = getList(result.destination.droppableId)
    const [movedTask] = sourceList.splice(result.source.index, 1);
    destinationList.splice(result.destination.index, 0, movedTask);
    setLists(result.source.droppableId, sourceList);
    setLists(result.destination.droppableId, destinationList);
    // Pegando o ID da task que está sendo movida
    const movedTaskId = movedTask.id;
    const destinationStatus = result.destination.droppableId;
    handleUpdateStatusTarefa(movedTaskId, destinationStatus);
    // Atualizando o status da tarefa
    // console.log("Tarefa " + movedTaskId + " movida de", result.source.droppableId, "para", result.destination.droppableId);
  };
  const TaskColumn = ({ title, tasks, droppableId, bgColor = "bg-light", textColor = "text-dark" }) => (
    <div className="col-md-4">
      <div className={`p-2 borderless rounded ${bgColor}`}>
        <h2 className={`text-center ${textColor}`}>
          {title}
        </h2>
        <Droppable droppableId={droppableId}> 
          {(provided) => (
            <div className="list-group" {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided) => (
                    <div
                      className="list-group-item list-group-item-action shadow-sm mb-2 bg-light fw-bold"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {task.titulo}
                      {task.nota && (
                        <div className="text-muted">
                          <span className="fw-bold">Nota:</span> {task.nota}
                        </div>
                      )}
                      <div className="dropdown float-end">
                        <span
                          style={{ cursor: "pointer" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ⋮
                        </span>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                setNewTarefa(task);
                                setShowModal(true);
                                handleEditTarefa(task.id);
                              }}
                            >
                              Editar
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                setShowModalAlteraQuadro(true);
                                setTarefaQuadro({ id_tarefa: task.id });
                                console.log(TarefaQuadro);
                              }}
                            >
                              Alterar Quadro 
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => {
                                if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
                                  handleDeleteTarefa(task.id);
                                  fechTarefasByQuadroId(selectedBoard.id);
                                }
                              }}
                            >
                              Deletar
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))} 
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button
          className="btn btn-secondary w-100 mt-3"
          onClick={() => {
            setShowModal(true);
            setSelectedDroppableId(droppableId);
          }}
        >
          Adicionar tarefa
        </button>
      </div>
    </div>
  );
  const getList = (id) => {
    switch (id) {
      case "0":
        return toDoTasks;
      case "1":
        return inProgressTasks;
      case "2":
        return doneTasks;
      default:
        return [];
    }
  };
  const setLists = (id, newList) => {
    switch (id) {
      case "0":
        setToDoTasks(newList);
        break;
      case "1":
        setInProgressTasks(newList);
        break;
      case "2":
        setDoneTasks(newList);
        break;
      default:
        break;
    }
  };
  return (
    <div className="container mt-4">     
      <h1 className="text-center mb-4">📝 Lista de Tarefas</h1>
      <div className="text-left mb-3">
        <select
          value={selectedBoard?.id || "-1"} // Evita erro inicial
          onChange={(e) => {
            const selectedId = e.target.value; // Mantém como string se necessário
            const newBoard = boards.find((board) => board.id.toString() === selectedId); 
            if (newBoard) {
              setSelectedBoard(newBoard);
            }
          }}
          className="form-select w-auto d-inline-block"
        >
          <option value="-1">Selecione um quadro</option>
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.nome}
            </option>
          ))}
        </select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <main className="row">
          {/* Coluna Tarefas a Fazer */}
          <TaskColumn 
            title="Tarefas à fazer" 
            tasks={toDoTasks} 
            bgColor="bg-soft-dark border-custom" 
            textColor="text-light" 
            droppableId="0" 
          />
          <TaskColumn 
            title="Tarefas em andamento" 
            tasks={inProgressTasks} 
            bgColor="bg-soft-gray border-custom" 
            textColor="text-light" 
            droppableId="1" 
          />
          <TaskColumn 
            title="Tarefas concluídas" 
            tasks={doneTasks} 
            bgColor="bg-soft-blue border-custom" 
            textColor="text-light" 
            droppableId="2" 
          />
        </main>
      </DragDropContext>
      {/* Modal de Cadastro de Tarefas */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
            setNewTarefa({ titulo: "", descricao: "", status:"", nota: "" });
          }}
          >
          <Modal.Header closeButton>
            <Modal.Title>{NewTarefa.id ? "Editar Tarefa" : "Criar Nova Tarefa"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
              type="text"
              value={NewTarefa.titulo}
              onChange={(e) => setNewTarefa({ ...NewTarefa, titulo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
              as="textarea"
              rows={3}
              value={NewTarefa.descricao}
              onChange={(e) => setNewTarefa({ ...NewTarefa, descricao: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nota</Form.Label>
              <Form.Control
              type="text"
              value={NewTarefa.nota}
              onChange={(e) => setNewTarefa({ ...NewTarefa, nota: e.target.value })}
              />
            </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
                setNewTarefa({ titulo: "", descricao: "", status: "", nota: "" });
              }}
              >
              Fechar
              </Button>
              <div className="d-flex gap-2">
                <Button variant="danger" onClick={() => { setShowModal(false); handleDeleteTarefa(NewTarefa.id);}}>
                Excluir
                </Button> 
                <Button variant="primary" onClick={NewTarefa.id ? handleUpdateTarefa : handleCreateTarefa}>
                {NewTarefa.id ? "Atualizar" : "Criar"}
                </Button>
              </div>
              </Modal.Footer>
      </Modal>
      {/* Modal de Alterar Quadro */}
      <Modal
        show={showModalAlteraQuadro}
        onHide={() => {
          setShowModalAlteraQuadro(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Alterar Quadro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Selecione o quadro de Destino</Form.Label>
            <Form.Select
              value={TarefaQuadro.id_quadro_destino || "-1"}
              onChange={(e) => setTarefaQuadro({ ...TarefaQuadro, id_quadro_destino: e.target.value })}
            > 
              <option value="-1">Selecione o quadro de destino</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => setShowModalAlteraQuadro(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={() => handleAlteraQuadroTarefa(TarefaQuadro.id_tarefa, TarefaQuadro.id_quadro_destino)}>
            Alterar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tarefas;