import "./App.css"
import HomePage from "./Pages/HomePage/HomePage";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Pages/LoginPage/LoginPage";
import Register from "./Pages/Register/Register";

function App() {

  return (
    <Routes>
      <Route path="/" Component={() => {
            const token = localStorage.getItem("token");
            return token ? <HomePage /> : Navigate({ to: "/login" });
      }}/>
      <Route path="/login" Component={()=>{
          const token = localStorage.getItem("token");
          return token ? Navigate({ to: "/" }) : <Login />;
      }}/>
      <Route path="*" Component={() => {
            Navigate({ to: "/login" });
      }}/>
      <Route path="/register" Component={()=>{
            const token = localStorage.getItem("token");
            return token ? Navigate({ to: "/" }) : <Register />;
      }} />
    </Routes>
  )
}

export default App
