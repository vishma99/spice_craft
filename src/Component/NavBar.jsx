import React, { useEffect, useState } from 'react'
import {Button, Navbar } from "flowbite-react";
import '../Page/navbar.css';





export default function NavBar() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
   

    fetch('http://localhost:8088/user')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  };


  

  return (
    <div>
    <Navbar fluid rounded style={{paddingBottom: '40px'}}>
      <Navbar.Brand href="">
        <img src="/src/image/Logo/logo-no-background.png"  alt=" " style={{width: '140px',height:'60px', paddingLeft:'10px', paddingTop:'10px'}}/>
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SpiceCraft</span> */}
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse >
        {/* <Navbar.Link href="#" active>
          Home
        </Navbar.Link> */}
        <Navbar.Link className='homePage' href="/home">Home</Navbar.Link> 
        <Navbar.Link className='homePage' href="/about">About Us</Navbar.Link>
        <Navbar.Link className='homePage' href="/shop" >Our Product</Navbar.Link>
        <Navbar.Link className='homePage' href="/contact">Contact Us</Navbar.Link>
        
        
        <Navbar.Link className='homePage' href="/cart" ><i className="fa-solid fa-cart-shopping"></i> </Navbar.Link>
        
        
      </Navbar.Collapse>
      {/* { userInfo ? (
        <NavDropdown title={userInfo.name} id='username'> 
          <Navbar.Link href='/dash'>
            <NavDropdown.Item>
              profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={logoutHandler}>
              Logout
            </NavDropdown.Item>
          
          </Navbar.Link>
        </NavDropdown>
      ): ( <div className="flex md:order-2">
        <Button className='button1'><a href="/login" >Login</a></Button>
        
        
          
        </div>)} */}
     
     

     
   
     {data.length > 0 && (
  <h1>{data[0].username}</h1>
)}
  

 <div className="flex md:order-2">

        <Button className='button1'><a href="/login" >Login</a></Button>
        
        
          
        </div>
    </Navbar>
    
    </div> 
  )
}

