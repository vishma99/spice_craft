import React, { useEffect } from 'react'
import NavBar from '../Component/NavBar'
import Footer from '../Component/Footer'
import '../Page/home.css'


export default function Home() {
  useEffect(() => {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.home-hero-slider .slide');
    const showSlides = () => {
      slides.forEach((slide, index) => {
        slide.style.display = index === slideIndex ? 'block' : 'none';
      });
      slideIndex = (slideIndex + 1) % slides.length;
    };
    showSlides();
    const interval = setInterval(showSlides, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      
      <header className="home-hero-section">
        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <h1 className="hero-title">Find the right spice, right away</h1>
            <div className="search-bar">
              <input type="text" placeholder="Search for any spice..." />
              <button type="button">Search</button>
            </div>
            <div className="hero-description">
              <p>Discover a world of flavors with our premium, ethically sourced spices. Perfect for every dish and every occasion.</p>
            </div>
          </div>
        </div>
      </header>

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
            <p>Create your own unique spice blends with our high-quality ingredients. Perfect for chefs and home cooks alike.</p>
          </div>
          <div className="home-feature">
            <img src="/src/image/backgroundImage.jpg" alt="Custom Spice Blends" />
            <h3>Custom Spice Blends</h3>
            <p>Create your own unique spice blends with our high-quality ingredients. Perfect for chefs and home cooks alike.</p>
          </div>
        </div>
      </section>

      <section className="home-about-section">
        <div className="home-about-content">
          <h2>About SpiceCraft</h2>
          <p>At SpiceCraft, we blend tradition and quality to bring you the finest spices. Our commitment to ethical sourcing and superior standards ensures an authentic sensory experience from farm to table.</p>
          <a href="/about" className="btn">Learn More</a>
        </div>
        <div className="home-about-img">
          <img src="/src/image/about4.jpg" alt="About SpiceCraft" />
        </div>
      </section>

      <section className="home-contact-section">
        <h2>Get in Touch!!!</h2>
        <p>Have any questions or feedback? We'd love to hear from you!</p>
        <a href="/contact" className="btn">Contact Us</a>
      </section>


     
    </>
  );
}