import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Routes from './routes.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Validate_Token } from './services/api.js';

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      if (window.location.pathname === "/register") return;
      const token = localStorage.getItem("AuthToken");
      if (!token) 
      {
        navigate("/");
        return;
      }
      try {
      const response = await Validate_Token(token);
      if (response.statusCode === 401) 
      {
        localStorage.removeItem("AuthToken");
        navigate("/");
        return;
      }
      else 
      {
        navigate("/home");
      }
      } 
      catch (error) 
      {
        localStorage.removeItem("AuthToken");
        console.log("Erro ao validar token:" + error);
        navigate("/");
      }
    };
    checkToken();
  }, [navigate]);

  return (
    <Routes />
  );
}

export default App;