import React, { useState } from "react";
import "./login.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

export default function Login() {
  const [action, setAction] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for remember me
  const [values, setValues] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    email: "",
  });
  const [loginvalues, setLoginValues] = useState({
    email: "",
    address: "",
  });

  const registerLink = () => {
    setAction(" active");
  };
  const loginLink = () => {
    setAction("");
  };
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };
  const handleLoginInput = (event) => {
    const { name, value } = event.target;
    setLoginValues({ ...loginvalues, [name]: value });
  };

  const handleRememberMe = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmitSignup = (event) => {
    event.preventDefault();

    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios
      .post("http://localhost:8088/register", values)
      .then((res) => setAction(""))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8088/login", loginvalues)
      .then((res) => {
        console.log(loginvalues);
        if (res.data.status === "success") {
          const token = res.data.token;

          if (rememberMe) {
            Cookies.set("token", token, { expires: 7 }); // Save token for 7 days
          } else {
            Cookies.set("token", token); // Session cookie
          }

          navigate("/");
        } else {
          alert("Incorrect username or password!");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="form-box-body">
      <div className={`wrapper${action}`}>
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
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
            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={registerLink}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
        <div className="form-box register">
          <form onSubmit={handleSubmitSignup}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                onChange={handleInput}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                onChange={handleInput}
              />
              <MdEmail className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Contact Number"
                required
                name="contactNumber"
                onChange={handleInput}
              />
              <MdEmail className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Address"
                required
                name="address"
                onChange={handleInput}
              />
              <MdEmail className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                name="username"
                onChange={handleInput}
              />
              <FaLock className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                onChange={handleInput}
              />
              <FaLock className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                name="confirmPassword"
                onChange={handleInput}
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />I agree to the terms & conditions
              </label>
            </div>
            <button type="submit" name="submit">
              Register
            </button>
            <div className="register-link">
              <p>
                Already have an account?{" "}
                <a href="#" onClick={loginLink}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
