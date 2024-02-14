import { useState } from "react";
import axiosInstance from "../../axios";
import { Navbar ,NavbarBrand,NavItem,Button} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Register.css"

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const addUser = (e) => {
    e.preventDefault();

    const requestBody = {
      name,
      username,
      password,
    };

    axiosInstance().post("http://localhost:3000/register", requestBody).then((res) => {
        setName("");
        setUsername("");
        setPassword("");

        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        const token = res.data.token;
        localStorage.setItem("token", token);

        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <>

      <form onSubmit={addUser}>
        <label htmlFor="register" className="label-reg">Register</label>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" onChange={(e) => { setName(e.target.value);}} value={name}/>
        </div>
        <div>
          <label htmlFor="">Username:</label>
          <input type="text" name="username" id="username" onChange={(e) => { setUsername(e.target.value);}} value={username}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" onChange={(e) => { setPassword(e.target.value);}} value={password}/>
        </div>
        <button onClick={()=>{
            navigate("/login");
        }}>Login</button>
        <button type="submit">Submit</button>
        
      </form>

      <ToastContainer />
    </>
  );
};

export default Register;
