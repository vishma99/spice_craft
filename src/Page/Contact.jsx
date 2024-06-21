import React from "react";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";

import "./contact.css";

export default function contact() {
  return (
    <>
    
      <div className="heading">
        <h1>Contact Us</h1>
      </div>

      <section id="contact" className="contact">
        <div className="contact-box-container mx-auto">
          <div className="contact-box">
            <i className="fas fa-map-marker-alt"></i>
            <h3>address ffffff</h3>
          </div>

          <div className="contact-box">
            <i className="fas fa-envelope"></i>
            <h3>naveenbharatha9876@gmail.com</h3>
          </div>

          <div className="contact-box">
            <i className="fas fa-phone"></i>
            <h3>+94770024639</h3>
          </div>
        </div>

        <div className="form-container mx-auto">
          <tr>
            <br></br><br></br><br></br><br></br><br></br>
            <td className="form-container1">
          <div >
            <h2 style={{ fontSize: "24px" , paddingBottom: '10px'}}>Send your Inquiries to us</h2>
            <p style={{ fontSize: "16px" , paddingTop: '10px', letterSpacing: '1px'}}>
              If you want to know more about our products or simply get in touch
              with us, fill in the form here and we'd be happy to buzz you.
            </p>
          </div>
          </td>
          <td className="form-container2">
          <div >
            <form action="">
              <div className="inputBox">
                <input type="text" placeholder="Full name" />
                <input type="text" placeholder="Telephone Number" />
              </div>
              <input type="email" placeholder="email" />
              <textarea
                name=""
                id=""
                cols={"30"}
                rows={"10"}
                placeholder="Enter Your Message Here"
              ></textarea>
              <input type="submit" value={"send"} />
            </form>
          </div>
          </td>
          </tr>
        </div>
        
      </section>

     
    </>
  );
}
