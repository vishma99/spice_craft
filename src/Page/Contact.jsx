import { useState } from "react";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import axios from "axios";
import Swal from "sweetalert2";

import "./contact.css";

export default function Contact() {
  const [values, setValues] = useState({
    name: "",
    contractNumber: "",
    message: "",
    email: "",
  });

  const [error, setError] = useState("");

  const handleInput = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleInquiry = (event) => {
    event.preventDefault();

    const contactNumberPattern = /^[0-9]{10}$/;
    if (!contactNumberPattern.test(values.contractNumber)) {
      setError("Please enter a valid contact number.");
      return;
    }

    axios
      .post("http://localhost:8088/inquiry", values)
      .then((res) => {
        setError("");
        Swal.fire({
          title: "Success!",
          text: "Send inquiry successfully.",
          icon: "success",
          customClass: {
            confirmButton: "swal2-confirm",
          },
        });
        console.log("Inquiry successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <NavBar />
      <div className="heading">
        <h1>Contact Us</h1>
      </div>

      <section id="contact" className="contact">
        <div className="contact-box-container mx-auto">
          <div className="contact-box">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Ginimellagaha west, Gonapinuwala</h3>
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
          <div className="form-content">
            <div className="form-container1">
              <h2>Send your Inquiries to us</h2>
              <p>
                If you want to know more about our products or simply get in
                touch with us, fill in the form here and we'd be happy to buzz
                you.
              </p>
            </div>
            <div className="form-container2">
              <form onSubmit={handleInquiry}>
                <div className="inputBox">
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    name="name"
                    onChange={handleInput}
                  />
                  <div>
                    <input
                      type="text"
                      placeholder="Telephone Number"
                      required
                      name="contractNumber"
                      onChange={handleInput}
                    />
                    {error && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {error}
                      </span>
                    )}
                  </div>
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  onChange={handleInput}
                />
                <textarea
                  placeholder="Enter Your Message Here"
                  required
                  name="message"
                  onChange={handleInput}
                ></textarea>
                <input type="submit" value="Send" />
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
