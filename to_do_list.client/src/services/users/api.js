import axios from "axios";
const api = axios.create({
    baseURL: "https://localhost:7202/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('AuthToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const Register = async (email, name, password) => {
    try {
        const response = await api.post("/Users/Register", {
            email: email,
            nome: name,
            senha: password,
        });
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
};
export const GetUsers = async () => {
    try {
        const response = await api.get("/Users/GetAllUsers");
        return response;
    } catch (error) {
        return error.response?.data;
    }
};
export const GetUserById = async (id) => {
    try {
        const response = await api.get(`/Users/GetUsersId${id}`);
        return response;
    } catch (error) {
        return error.response?.data;
    }
};
export const DeleteUser = async (id) => {
    try {
        const response = await api.delete(`/Users/DeleteUser${id}`);
        return response;
    } catch (error) {
        return error.response?.data;
    }
};
export const UpdateUserById = async (id, email, nome, senha) => {
    try { 
        const response = await api.put(`/Users/UpdateUser/${id}`, {
            email: email,
            senha: senha || "",
            nome: nome,
        });

        console.log(`Resposta da API:`, response);
        return response;
    } catch (error) {
        console.error(`Erro na requisição:`, error);
        return error.response?.data || { message: "Erro desconhecido" };
    }
};

export default api;