import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5029/api",
});

export const login = async (email, password) => {
    try{
        const response = await api.post("/Security/Login", {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const Validate_Token = async (token) => {
    try{
        const response = await api.get("/Security/Validate-Token", {
            headers: { AuthToken: token},
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const GetUserInformation = async (token) => {
    try{
        const response = await api.get("/Security/GetUserInformation", {
            headers: { AuthToken: token},
        });
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }
}
export const Register = async (email, name, password) => {
    try{
        const response = await api.post("/Users/Register", {
            email : email,
            nome : name,
            senha : password
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const GetUsers = async () => {
    try{
        const response = await api.get("/Users/GetAllUsers");
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const GetUserById = async (id) => {
    try{
        const response = await api.get(`/Users/GetUsersId${id}`);
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const DeleteUser = async (id) => {
    try{
        const response = await api.delete(`/Users/DeleteUser${id}`);
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const CreateTarefa = async (title, descricao, userId) => {
    try{
        console.log("Criando Tarefa" + title, descricao, userId);
    } catch (error) {
        return error.response.data;
    }
}
export default api;