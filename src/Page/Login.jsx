import { useState } from "react";
import "./login.css";
import { FaUser, FaLock, FaAddressCard } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 

export default function Login() {
  const [action, setAction] = useState("");
  const [rememberMe, setRememberMe] = useState(false); 
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    email: "",
  });
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
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
    setLoginValues({ ...loginValues, [name]: value });
  };

  const handleRememberMe = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmitSignup = (event) => {
    event.preventDefault();

    const contactNumberPattern = /^[0-9]{10}$/;
    if (!contactNumberPattern.test(values.contactNumber)) {
      setError("Please enter a valid contact number.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios
      .post("http://localhost:8088/register", values)
      .then((res) => {
        setAction("");
        setError(""); 
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          setError("Email already in use"); 
        } else {
          console.log(err);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8088/login", loginValues)
      .then((res) => {
        if (res.data.status === "success") {
          const token = res.data.token;

          if (rememberMe) {
            Cookies.set("token", token, { expires: 7 }); // Save token for 7 days
          } else {
            Cookies.set("token", token); // Session cookie
          }

          navigate("/"); // Redirect to home page
        } else {
          alert(res.data.message); // Display error message from the backend
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          alert("Your account is inactive. Please contact support.");
        } else {
          console.error("Error logging in:", err);
        }
      });
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
                placeholder="Email"
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

              <MdContactPhone className="icon" />
              {error && <span className="error-message">{error}</span>}
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Address"
                required
                name="address"
                onChange={handleInput}
              />
              <FaAddressCard className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                name="username"
                onChange={handleInput}
              />
              <FaUser className="icon" />
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
                <input type="checkbox" required />I agree to the terms &
                conditions
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
