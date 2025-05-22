import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Routes from './routes.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      try 
      {
        if (window.location.pathname === "/register") return;
        const token = localStorage.getItem("AuthToken");
        if (!token)
        {
          navigate("/login");
          return;
        }
        else 
        {
          navigate("/");
        }
      } 
      catch (error) 
      {
        localStorage.removeItem("AuthToken");
        localStorage.removeItem("UserID");
        localStorage.removeItem("UserName");
        console.log("Erro ao validar token:" + error);
        navigate("/login");
      }
    };
    checkToken();
  }, [navigate]);
  return (
    <Routes />
  );
}
export default App;