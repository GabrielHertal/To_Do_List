import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Button } from "react-bootstrap";
import { GetUsers, CreateTarefa, GetTarefasByUserId } from "../services/api";

const Tarefas = () => {
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [NewTarefa, setNewTarefa] = useState({ titulo: "", descricao: "", userId: "", status: ""}); // Novo usuário
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await GetUsers();
      if (res && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
        console.error("Erro: a API nao retornou um array valido.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fechTarefasByUserId = async () => {
    try {
      const IdUserConnected = localStorage.getItem("UserID");
      const response = await GetTarefasByUserId(IdUserConnected);
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
    fetchUsers();
    const userId = localStorage.getItem("UserID");
    fechTarefasByUserId(userId);
  }, []);

  const handleCreateTarefa = async () => {
    try {
      console.log(NewTarefa);
      const data = await CreateTarefa(NewTarefa.titulo, NewTarefa.descricao, null , NewTarefa.userId, NewTarefa.status);
      console.log(data.status);
      if (data.status === 200) {
        alert("Tarefa cadastrado com sucesso");
        setShowModal(false);
        fechTarefasByUserId(NewTarefa.userId); // Refresh tasks after creating a new one
      } else if (data.status === '409') {
        setNewTarefa({ titulo: "", descricao: "", userId: "", status: "" });
        alert("Tarefa já cadastrado");
        return;
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; // Se não houver destino, não faz nada

    const sourceList = getList(result.source.droppableId);
    const destinationList = getList(result.destination.droppableId);

    const [movedTask] = sourceList.splice(result.source.index, 1);
    destinationList.splice(result.destination.index, 0, movedTask);

    setLists(result.source.droppableId, sourceList);
    setLists(result.destination.droppableId, destinationList);

    console.log("Tarefa movida de", result.source.droppableId, "para", result.destination.droppableId);
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
                      className="list-group-item list-group-item-action shadow-sm mb-2 bg-light"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => {
                        setNewTarefa(task);
                        setShowModal(true);
                      }}
                    >
                      {task.titulo}
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
        <button className="btn bg-light w-100 mt-2" onClick={() => setShowModal(true)}>Adicionar tarefa</button>
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
      <DragDropContext onDragEnd={onDragEnd}>
        <main className="row">
          {/* Coluna Tarefas a Fazer */}
          <TaskColumn title="Tarefas à fazer" tasks={toDoTasks} bgColor="bg-danger" droppableId="0" />

          {/* Coluna Tarefas em andamento */}
          <TaskColumn title="Tarefas em andamento" tasks={inProgressTasks} bgColor="bg-warning" droppableId="1" />

          {/* Coluna Tarefas Concluídas */}
          <TaskColumn title="Tarefas concluídas" tasks={doneTasks} droppableId="2" bgColor="bg-success" textColor="text-white" />
        </main>
      </DragDropContext>

      {/* Modal de Cadastro */}
      <Modal
        show={showModal}
        onShow={fetchUsers}
        onHide={() => {
          setShowModal(false);
          setNewTarefa({ titulo: "", descricao: "", userId: "", status:"" });
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
              <Form.Label>Usuário</Form.Label>
              <Form.Select
                value={NewTarefa.userId || ""}
                onChange={(e) => setNewTarefa({ ...NewTarefa, userId: e.target.value })}
              >
                <option value="">Selecione um usuário</option>
                {users.length > 0 ? (
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nome}
                    </option>
                  ))
                ) : (
                  <option disabled>Carregando usuários...</option>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={NewTarefa.status || ""}
                onChange={(e) => setNewTarefa({ ...NewTarefa, status: e.target.value })}
              >
                <option value="">Selecione um status</option>
                <option value="0">A fazer</option>
                <option value="1">Em andamento</option>
                <option value="2">Concluído</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setNewTarefa({ titulo: "", descricao: "", userId: "", status: "" });
            }}
          >
            Fechar
          </Button>
          <Button variant="primary" onClick={handleCreateTarefa}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tarefas;