import React from 'react'
import Nav from 'react-bootstrap/Nav';

export default function Footer() {
  return (
    <>
     <br></br><br></br><br></br><br></br>
     <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="/home">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Shop</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Order</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Wishlist</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Customization</Nav.Link>
        </Nav.Item>
     


     
      </Nav>
      <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="/home"><i class="fa-brands fa-facebook"></i></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1"><i class="fa-brands fa-instagram"></i></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2"><i class="fa-brands fa-twitter"></i></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2"><i class="fa-brands fa-whatsapp"></i></Nav.Link>
        </Nav.Item>
        


     
      </Nav>


     <br></br>
     
     <hr></hr>
      <p className="text-center mt-4 mb-4">Copyright © 2024 | SpiceCraft</p>
      
    
    </>
  )
}
