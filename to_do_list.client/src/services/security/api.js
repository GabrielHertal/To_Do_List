import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7202/api",
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
export default api;