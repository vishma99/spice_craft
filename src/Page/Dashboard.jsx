import React, { useState, useEffect } from "react";
import NavBar from "../Component/NavBar";
import Footer from '../Component/Footer';

export default function Dashboard() {
  const [data1, setData1] = useState([]);
  useEffect(() => {
   fetch("http://localhost:8088/registercustomerAdmin")
    
      .then((res) => res.json())
      .then((data1) => setData1(data1))
      .catch((err) => console.log(err));
  }, []);
  const [data2, setData2] = useState([]);
  useEffect(() => {
    
     fetch("http://localhost:8088/productAdmin")
     
       .then((res) => res.json())
       .then((data2) => setData2(data2))
       .catch((err) => console.log(err));
   }, []);
   const [data3, setData3] = useState([]);
   useEffect(() => {
   
      fetch("http://localhost:8088/orderAdmin")
       .then((res) => res.json())
       .then((data3) => setData3(data3))
       .catch((err) => console.log(err));
   }, []);
   const [data4, setData4] = useState([]);
   useEffect(() => {
   
      fetch("http://localhost:8088/inquiryAdmin")
       .then((res) => res.json())
       .then((data4) => setData4(data4))
       .catch((err) => console.log(err));
   }, []);
  return (
    <div>
      <NavBar/>
      <div
        className="contact-box-container mx-auto"
        style={{ fontWeight: "bold", fontSize: "16px" }}
      >
        <div className="contact-box">
          <h2>No. of customers</h2>
          <h2>1</h2>
        </div>

        <div className="contact-box">
          <h2>No. of products</h2>
          <h2>8</h2>
        </div>

        <div className="contact-box">
          <h2>No. of orders</h2>
          <h2>3</h2>
        </div>
      </div>

      <div style={{ padding: "50px" }}>
        <h2  style={{ fontWeight: "bold", fontSize: "18px", paddingBottom:'30px'}}>customer</h2>
        <hr style={{paddingBottom:'30px'}}/>
        <table style={{width:'100%', height:'100px'}}>
          <thead >
            <th >CostomerId</th>
            <th >Name</th>
            <th >Email</th>
            <th>Contact No</th>
            <th>Address</th>
            
          </thead>
          <tbody>
            {data1.map((d, i) => (
              <tr key={i}>
                <td>{d.customerId}</td>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.contactNumber}</td>
                <td>{d.address}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "50px" }}>
        <h2  style={{ fontWeight: "bold", fontSize: "18px", paddingBottom:'30px'}}>product</h2>
        <button style={{backgroundColor:'#A91D3A',borderRadius:'10px', color:'#fff',marginBottom: '20px'}}>Add Product</button>
        <hr style={{paddingBottom:'30px'}}/>
        <table style={{width:'100%', height:'100px'}}>
          <thead >
            <th >productId</th>
            <th >Name</th>
            <th >Price</th>
          
            
          </thead>
          <tbody>
            {data2.map((d, i) => (
              <tr key={i}>
                <td>{d.productId}</td>
                <td>{d.product_name}</td>
                <td>{d.price}</td>
               
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>



       <div style={{ padding: "50px" }}>
        <h2  style={{ fontWeight: "bold", fontSize: "18px", paddingBottom:'30px'}}>Orders</h2>
        
        <hr style={{paddingBottom:'30px'}}/>
        <table style={{width:'100%', height:'100px'}}>
          <thead >
            <th >OrderId</th>
            <th >CustomerId</th>
            <th >Price</th>
            <th >Quantity</th>
          
            
          </thead>
          <tbody>
            {data3.map((d, i) => (
              <tr key={i}>
                <td>{d.cartId}</td>
                <td>{d.customerId}</td>
                <td>{d.price}</td>
                <td>{d.quantity}</td>
               
                
              </tr>
            ))}
          </tbody>
        </table>
      </div> 



      
      <div style={{ padding: "50px" }}>
        <h2  style={{ fontWeight: "bold", fontSize: "18px", paddingBottom:'30px'}}>Inquiry</h2>
        
        <hr style={{paddingBottom:'30px'}}/>
        <table style={{width:'100%', height:'100px'}}>
          <thead >
            <th >CustomerId</th>
            <th >Name</th>
            <th >Email</th>
            <th >Message</th>
          
            
          </thead>  
          <tbody>
            {data4.map((d, i) => (
              <tr key={i}>
                s
                <td>{d.customerId}</td>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.message}</td>
               
                
              </tr>
            ))}
          </tbody>
        </table>
      </div> 
<Footer/>
    </div>
  );
}
