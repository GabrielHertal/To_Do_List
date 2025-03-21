import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Button } from "react-bootstrap";
import { GetUsers, CreateTarefa } from "../services/api";

const Tarefas = () => {
  const [toDoTasks, setToDoTasks] = useState([
    { id: "1", content: "Fazer login no sistema" },
    { id: "2", content: "Criar API de autenticação" },
    { id: "3", content: "Finalizar layout do dashboard" },
  ]);

  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [NewTarefa, setNewTarefa] = useState({ name: "", email: "", userId: "" }); // Novo usuário
  const [inProgressTasks, setInProgressTasks] = useState([]);
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

  useEffect(() => {
    console.log(users);
  }, [users]);

  const handleCreateTarefa = async () => {
    try {
      console.log(NewTarefa.userId);
      const data = await CreateTarefa(NewTarefa.title, NewTarefa.descricao, NewTarefa.userId);
      if (data.status === '200') {
        alert("Usuário cadastrado com sucesso");
        setShowModal(false);
        fetchUsers();
      } else if (data.status === '409') {
        setNewTarefa({ name: "", email: "", password: "" });
        alert("Usuário já cadastrado");
        return;
      }
    } catch (error) {
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
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      className="list-group-item list-group-item-action shadow-sm mb-2 bg-light"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {task.content}
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
      case "Fazer":
        return toDoTasks;
      case "Fazendo":
        return inProgressTasks;
      case "Concluida":
        return doneTasks;
      default:
        return [];
    }
  };

  const setLists = (id, newList) => {
    switch (id) {
      case "Fazer":
        setToDoTasks(newList);
        break;
      case "Fazendo":
        setInProgressTasks(newList);
        break;
      case "Concluida":
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
          <TaskColumn title="Tarefas à fazer" tasks={toDoTasks} bgColor="bg-danger" droppableId="Fazer" />

          {/* Coluna Tarefas em andamento */}
          <TaskColumn title="Tarefas em andamento" tasks={inProgressTasks} bgColor="bg-warning" droppableId="Fazendo" />

          {/* Coluna Tarefas Concluídas */}
          <TaskColumn title="Tarefas concluídas" tasks={doneTasks} droppableId="Concluida" bgColor="bg-success" textColor="text-white" />
        </main>
      </DragDropContext>

      {/* Modal de Cadastro */}
      <Modal
        show={showModal}
        onShow={fetchUsers}
        onHide={() => {
          setShowModal(false);
            setNewTarefa({ name: "", email: "", password: "" });
            }}
            >
            <Modal.Header closeButton>
            <Modal.Title>{NewTarefa.title ? "Editar Tarefa" : "Criar Nova Tarefa"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
              type="text"
              value={NewTarefa.title}
              onChange={(e) => setNewTarefa({ ...NewTarefa, title: e.target.value })}
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
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setNewTarefa({ title: "", descricao: "", password: "" });
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