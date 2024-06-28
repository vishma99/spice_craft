import React, { useEffect } from 'react'
import NavBar from '../Component/NavBar'
import Footer from '../Component/Footer'
import '../Page/home.css'


export default function Home() {

  return (
    <>
      <NavBar />
      <section className="home-hero-section">
        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <h1 className="hero-title">Find the right spice, right away</h1>
            <div className="search-bar">
              <input type="text" placeholder="Search for any spice..." />
              <button>Search</button>
            </div>
            <p className="hero-description">Discover the finest spices sourced from around the world, perfect for enhancing your culinary creations.</p>
          </div>
        </div>
      </section>

      <section className="home-feature-section">
        <h2>Our Features</h2>
        <div className="home-features">
          <div className="home-feature">
            <img src="/src/image/backgroundImage.jpg" alt="Quality Spices" />
            <h3>Premium Quality</h3>
            <p>Only the finest spices, sourced ethically and sustainably.</p>
          </div>
          <div className="home-feature">
            <img src="/src/image/backgroundImage.jpg" alt="Ethically Sourced" />
            <h3>Ethically Sourced</h3>
            <p>Supporting farmers and ensuring fair trade practices.</p>
          </div>
          <div className="home-feature">
            <img src="/src/image/backgroundImage.jpg" alt="Custom Spice Blends" />
            <h3>Custom Spice Blends</h3>
            <p>Create your own unique spice blends with our high-quality ingredients.</p>
          </div>
          <div className="home-feature">
            <img src="/src/image/backgroundImage.jpg" alt="Custom Spice Blends" />
            <h3>Global Delivery</h3>
            <p>Fast shipping to bring our spices to your doorstep, no matter where you are in the world.</p>
          </div>
        </div>
      </section>

      <section className="home-about-section">
      <div className="home-about-overlay">
        <div className="home-about-content">
          <h2>About SpiceCraft</h2>
          <p>At SpiceCraft, Our mission is to bring the rich and diverse flavors of global cuisine to your kitchen, while supporting sustainable and ethical practices in the spice industry.</p>
            <ul>
              <li>High-quality, ethically sourced spices</li>
              <li>Custom spice blends tailored to your needs</li>
              <li>Commitment to sustainability and fair trade</li>
              <li>Expertise in spice selection and blending</li>
            </ul>
          <a href="/about" className="btn">Learn More</a>
        </div>
        </div>
      </section>

      <section className="home-contact-section">
        <h2>Get in Touch!!!</h2>
        <p>Have any questions or feedback? We'd love to hear from you!</p>
        <a href="/contact" className="btn">Contact Us</a>
      </section>


      <Footer/>
    </>
  );
}