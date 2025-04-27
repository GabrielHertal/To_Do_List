import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Button } from "react-bootstrap";
import { CreateTarefa, GetTarefaByQuadroId, GetTarefaById, UpdateTarefa, UpdateStatusTarefa } from "../services/tarefas/api";
import { GetQuadrosByUserId } from "../services/quadros/api";

const Tarefas = () => {
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [NewTarefa, setNewTarefa] = useState({ titulo: "", descricao: "", status: "", nota: "" }); // Novo usuário
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [selectedDroppableId, setSelectedDroppableId] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState({ id: "", name: "" });
  const [boards, setBoards] = useState([]);

  const fetchQuadros = async () => {
    try {
      const userid = localStorage.getItem("UserID");
      const res = await GetQuadrosByUserId(userid);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setBoards(res.data);
        setSelectedBoard(res.data[0]);
      } else {
        setBoards([]);
        setSelectedBoard(null);
        alert("Erro: a API nao retornou um array valido.");
        console.error("Erro: a API nao retornou um array valido.");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      const data = await UpdateTarefa(NewTarefa.id, NewTarefa.titulo, NewTarefa.descricao, NewTarefa.status, NewTarefa.nota);
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
        // Categorize tasks
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
    const fetchQuadros = async () => {
      try {
        const userid = localStorage.getItem("UserID");
        const res = await GetQuadrosByUserId(userid);
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          setBoards(res.data);
          setSelectedBoard(res.data[-1]); // 🚀 Definir primeiro quadro automaticamente
        } else {
          setBoards([]);
          setSelectedBoard(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchQuadros();
  }, []);
  
  const handleCreateTarefa = async () => {
    try {
      const data = await CreateTarefa(NewTarefa.titulo, NewTarefa.descricao, null , NewTarefa.userId, selectedDroppableId, NewTarefa.nota);
      if (data.status === 200) {
        alert("Tarefa cadastrado com sucesso");
        setNewTarefa({ titulo: "", descricao: "", userId: "", status: "", nota: "" });
        setShowModal(false);
        fechTarefasByQuadroId(selectedBoard.id); 
      } else if (data.status === 409) {
        setNewTarefa({ titulo: "", descricao: "", userId: "", status: "", nota:"" });
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
  const onDragEnd = (result) => {
    if (!result.destination) return; // Se não houver destino, não faz nada

    const sourceList = getList(result.source.droppableId);
    const destinationList = getList(result.destination.droppableId);

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
      <div className={`p-2 border rounded ${bgColor}`}>
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
                      onClick={() => {
                        setNewTarefa(task);
                        setShowModal(true);
                        handleEditTarefa(task.id);
                        }}
                      >
                        {task.titulo}
                        {task.nota && (
                        <div className="text-muted ">
                          <span className="fw-bold">Nota:</span> {task.nota}
                        </div>
                        )}
                        <span className="float-end" style={{ cursor: "pointer" }} onClick={() => {
                        setNewTarefa(task);
                        setShowModal(true);
                      }}>⋮</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button className="btn bg-light w-100 mt-2 fw-bold" 
          onClick={() => {
                          setShowModal(true);
                          setSelectedDroppableId(droppableId);}}
        >Adicionar tarefa
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
      <h3 className="text-center">📝 Lista de Tarefas</h3>
      <div className="text-left mb-3">
        <select
          value={selectedBoard?.id || ""} // Evita erro inicial
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
          <TaskColumn title="Tarefas à fazer" tasks={toDoTasks} bgColor="bg-danger" droppableId="0" />

          {/* Coluna Tarefas em andamento */}
          <TaskColumn title="Tarefas em andamento" tasks={inProgressTasks} bgColor="bg-warning" droppableId="1" />

          {/* Coluna Tarefas Concluídas */}
          <TaskColumn title="Tarefas concluídas" tasks={doneTasks} bgColor="bg-success" droppableId="2" />
        </main>
      </DragDropContext>

      {/* Modal de Cadastro de Tarefas */}
      <Modal
        show={showModal}
        onShow={fetchQuadros}
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
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setNewTarefa({ titulo: "", descricao: "", status: "", nota: "" });
            }}
          >
            Fechar
          </Button>
          <Button variant="primary" onClick={NewTarefa.id ? handleUpdateTarefa : handleCreateTarefa}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tarefas;