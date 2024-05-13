import React from 'react'
import {Button, Navbar } from "flowbite-react";
import '../Page/navbar.css';


export default function NavBar() {
  return (
    <Navbar fluid rounded style={{paddingBottom: '40px'}}>
      <Navbar.Brand href="">
        <img src="/src/image/Logo/logo-no-background.png"  alt=" " style={{width: '140px',height:'60px', paddingLeft:'10px', paddingTop:'10px'}}/>
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SpiceCraft</span> */}
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">Home</Navbar.Link>
        <Navbar.Link href="#">About Us</Navbar.Link>
        <Navbar.Link href="/shop">Our Product</Navbar.Link>
        <Navbar.Link href="#">Contact Us</Navbar.Link>
        
        
        <Navbar.Link href="#deets"><i class="fa-solid fa-cart-shopping"></i></Navbar.Link>
        
      </Navbar.Collapse>
      <div className="flex md:order-2">
      <Button className='button1'><a href="/login" >Login</a></Button>
        
      </div>

    </Navbar>
    
    
  )
}

