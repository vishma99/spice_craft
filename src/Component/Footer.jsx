import React from 'react'
import { Footer } from "flowbite-react";


export default function FooTer() {
  return (
    <>
<Footer container >
      <div className="w-full text-center" >
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="#"
            src="/src/image/Logo/logo-no-background.png"  style={{width: '150px',height:'100px', paddingLeft:'5px', paddingTop:'5px'}}
           
            
          />
          <Footer.LinkGroup style={{fontSize: '16px'}}>
          <Footer.Link href="/home">Home</Footer.Link>
            <Footer.Link href="/about">About Us</Footer.Link>
            <Footer.Link href="/shop">Our Product</Footer.Link>
            <Footer.Link href="/contact">Contact Us</Footer.Link>
            
          </Footer.LinkGroup>
          
        </div>
        
        <hr></hr>
        
        <Footer.Copyright href="#" by="SpiceCraft" year={2024}  style={{paddingTop:'20px' ,fontSize: '16px'}}/>
        
      </div>
    </Footer>

    
    </>
  )
}
