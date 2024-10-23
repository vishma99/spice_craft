import  { useState } from "react";
import "./login.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

export default function AdminLogin() {
    const [action, setAction] = useState("");
    const [rememberMe, setRememberMe] = useState(false); // State for remember me
    const [values, setValues] = useState({
      name: "",
      username: "",
      password: "",
   
      email: "",
    });
    const [loginvalues, setLoginValues] = useState({
      email: "",
      address: "",
    });
  
   
    
    const navigate = useNavigate();
  
   
    const handleLoginInput = (event) => {
      const { name, value } = event.target;
      setLoginValues({ ...loginvalues, [name]: value });
    };
  
    const handleRememberMe = (event) => {
      setRememberMe(event.target.checked);
    };
  
  
    const handleSubmit = (event) => {
      event.preventDefault();
      axios
        .post("http://localhost:8088/admin", loginvalues)
        .then((res) => {
          console.log(loginvalues);
          if (res.data.status === "success") {
            const token = res.data.token;
  
            if (rememberMe) {
              Cookies.set("token", token, { expires: 7 }); // Save token for 7 days
            } else {
              Cookies.set("token", token); // Session cookie
            }
  
            navigate("/dash");
          } else {
            alert("Incorrect username or password!");
          }
        })
        .catch((err) => console.log(err));
    };


  return (
    <div>
      <div className="form-box-body">
      <div className={`wrapper${action}`}>
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Admin Login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="email"
                required
                onChange={handleLoginInput}
                name="email"
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                onChange={handleLoginInput}
                name="password"
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" onChange={handleRememberMe} />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" name="submit">
              Login
            </button>
            
          </form>
        </div>
       
      </div>
    </div>
    </div>
  )
}
