import React, { useState, useEffect } from "react";
import Footer from "../Component/Footer";
import "./FAQ.css"; // Import the CSS file for styling
import NavBar from "./NavBar";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      const response = await fetch("http://localhost:8088/faqAdmin"); // Change to your backend URL
      const data = await response.json();
      setFaqs(data);
    };
    fetchFaqs();
  }, []);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <NavBar />
      <div className="faq-container">
        <div className="floating-message">Welcome to our FAQ section!</div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleAnswer(index)}>
                {faq.question}
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
