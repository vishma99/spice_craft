import React, { useState } from 'react';
import './login.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
//  import Validation from "./LoginValidation";
//  import ValidationSignup from './SignupValidation';
 import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export default function Login() {

const [action, setAction] = useState('');
const registerLink = () => {
    setAction(' active')
};
const loginLink = () => {
    setAction('')
   

};


const  [values, setValues] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    address: '',
    email: ''
})
const navigate = useNavigate();
// const [errors, setErrors] = useState({

// });

const handleInput =  (event) =>{
    setValues({...values,[event.target.name]: [event.target.value]})
};
const handleSubmitSignup = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8088/register', values)
    .then(res => 
        //  console.log("register successfuly")
         navigate('/shop'))
         .catch(err => console.log(err));

    // setErrors(ValidationSignup(values));
    // if(errors.name === "" && errors.username === "" && errors.password === "" && errors.contactNumber === "" 
    //     && errors.address === "" && errors.email === ""){
    //         axios.get('http://localhost:8085/registercustomer', values)
    //         .then(res => {
    //             // console.log('server response',res.data);
    //             navigate('/shop');
    //         })
    //         .catch(err => console.log(err));
    // }
};

const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8088/login', values)
    .then(res => {
        if(res.data === "success"){
            navigate('/home');

        }
        else{
            alert("incorrect username or password!!!!");
        }})
         .catch(err => console.log(err));
};






  return (
    <div className="form-box-body">
    <div className={`wrapper${action}`}>
        <div className="form-box login">
            <form onSubmit={handleSubmit}>    
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder='Username' required  onChange={handleInput} name='username'/>
                    {/* {errors.username && <span className='text-danger'>{errors.username}</span>} */}
                    <FaUser  className='icon'/>

                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required onChange={handleInput} name='password'/>
                    {/* {errors.password && <span className='text-danger'>{errors.password}</span>} */}
                    <FaLock  className='icon'/>

                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit" name='ubmit'>Login</button>
                <div className="register-link">
                    <p>Dont have an account? <a href="#" onClick={registerLink}>Register</a></p>
                </div>
            </form>
        </div>
        <div className="form-box register">
            <form onSubmit={handleSubmitSignup}>
                <h1>Registration</h1>
                <div className="input-box">
                    <input type="text" placeholder='Name' required name='name' onChange={handleInput}/>
                    {/* {errors.user && <span className='text-danger'>{errors.user}</span>} */}
                    <FaUser  className='icon'/>

                </div>
                <div className="input-box">
                    <input type="email" placeholder='Email' required name='email' onChange={handleInput}/>
                    {/* {errors.email && <span className='text-danger'>{errors.email}</span>} */}
                    <MdEmail  className='icon'/>

                </div>
                <div className="input-box">
                    <input type="text" placeholder='Contact Number' required name='contactNumber' onChange={handleInput}/>
                    {/* {errors.contactNumber && <span className='text-danger'>{errors.contactNumber}</span>} */}
                    <MdEmail  className='icon'/>

                </div>
                <div className="input-box">
                    <input type="text" placeholder='Address' required name='address' onChange={handleInput}/>
                    {/* {errors.address && <span className='text-danger'>{errors.address}</span>} */}
                    <MdEmail  className='icon'/>

                </div>
                <div className="input-box">
                    <input type="text" placeholder='Username' required name='username'onChange={handleInput}/>
                    {/* {errors.username && <span className='text-danger'>{errors.username}</span>} */}
                    <FaLock  className='icon'/>

                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required name='password' onChange={handleInput}/>
                    {/* {errors.password && <span className='text-danger'>{errors.password}</span>} */}
                    <FaLock  className='icon'/>

                </div>
                <div className="input-box">
                    <input type="confirmPassword" placeholder='Confirm Password' required name='paconfirmPassword' onChange={handleInput}/>
                    {/* {errors.password && <span className='text-danger'>{errors.password}</span>} */}
                    <FaLock  className='icon'/>

                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox" />I agree to the terms & conditions</label>
                    
                </div>

                <button type="submit" name='submit'>Register</button>
                <div className="register-link">
                    <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                </div>
            </form>
        </div>



    </div>
    </div>
  )
}
