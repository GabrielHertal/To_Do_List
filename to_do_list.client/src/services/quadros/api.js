import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5029/api",
  });

export const GetQuadros = async () => {
    try{
        const response = await api.get("/Quadro/GetAllQuadros");
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const CreateQuadro = async (nome, id_user) => {
    try{
        const response = await api.post("/Quadro/CreateQuadroAsync", {
            nome_quadro: nome,
            id_user_owner: id_user
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const GetQuadroById = async (id) => {
    try{
        const response = await api.get(`/Quadro/GetQuadroById${id}`); 
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const UpdateQuadroById = async (id, nome) => {
    try{
        const response = await api.put(`/Quadro/UpdateQuadroAsync/${id}/${nome}`)
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const DeleteQuadro = async (id) => {
    try{
        const response = await api.delete(`/Quadro/DeleteQuadro/${id}`); 
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const GetQuadrosByUserId = async (id_user) => {
    try{
        const response = await api.get(`/Quadro/GetQuadroByIdUser/${id_user}`);	
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const CreateCodigoConvite = async (tamanho) => {
    try{
        const response = await api.post(`/Quadro/CreateCodigoConvite/${tamanho}`,{
            tamanho: tamanho
        });
        return response;
    }
    catch(error){
        return error.response.data;
    }
}
export const GetQuadroByOwnerId = async (id_user) => {
    try{
        const response = await api.get(`/Quadro/GetQuadroByOwnerId/${id_user}`);	
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const VinculaCodigoConviteQuadro = async (id, codigo) => {
    try{
        const response = await api.put(`/Quadro/VinculaCodigoConviteQuadro/${id}/${codigo}`);
        return response
    }
    catch(error){
        return error.response.data;
    }
}
export const GetMembrosQuadro = async (id_quadro) => {
    try{
        const response = await api.get(`/Quadro/GetMembrosByQuadroID/${id_quadro}`);
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const VinculaQuadroUser = async (convite, id_user) => {
    try{
        const response = await api.post(`/Quadro/VincularUserQuadroAsync/${convite}/${id_user}`);	
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const DesvinculaQuadroUser = async (id_quadro, id_user) => {
    try{
        const response = await api.delete(`/Quadro/DesvincularUserQuadroAsync/${id_quadro}/${id_user}`);	
        return response;
    }
    catch(error){
        return error.response.data;
    }	
}
export default api;