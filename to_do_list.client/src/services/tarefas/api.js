import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5029/api",
  });

  export const CreateTarefa = async (titulo, descricao, data_criacao, userId, status, nota) => {
    try{ 
        const response = await api.post(`/Tarefas/CreateTarefaAsync`, {
            titulo : titulo,
            descricao : descricao,
            data_criacao : data_criacao,
            fkidusuario : userId,
            status : status,
            nota : nota
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const GetTarefasByUserId = async (id) => {
    try{
        const response = await api.get(`/Tarefas/GetTarefasByUser/${id}`);
        return response;
    }
    catch (error) {
        return error.response.data;
    }
}
export const GetTarefaById = async (id) => {
    try{
        const response = await api.get(`/Tarefas/GetTarefaByIDAsync/${id}`);
        return response;
    }
    catch (error) {
        return error.response.data;
    }
}
export const UpdateTarefa = async (id, titulo, descricao, userId, status, nota) => {
    try{ 
        const response = await api.put(`/Tarefas/UpdateTarefa/${id}`, {
            titulo : titulo,
            descricao : descricao,
            fkidusuario : userId,
            status : status,
            nota : nota
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const UpdateStatusTarefa = async (id, status) => {
    try{
        const response = await api.put(`/Tarefas/UpdateStatusTarefa/${id}`, {
            status : status
        });
        return response;
    }
    catch (error) {
        return error.response.data;
    }
}
export const GetTarefaByQuadroId = async (id) => {
    try{
        const response = await api.get(`/Tarefas/GetTarefasByQuadro/${id}`);
        return response;
    }
    catch (error) {
        return error.response.data;
    }
}
export default api;