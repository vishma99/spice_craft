import React from 'react'
import '../Page/about.css'
import NavBar from '../Component/NavBar'
import Footer from '../Component/Footer'

export default function About() {
  return (
  <>
 
  <section className='hero'>
    <div className="heading">
        <h1>About Us</h1>
    </div>
    <div className="container">
        <div className="hero-content">
            <h2>Crafting Tradition, Elevating Taste: Experience SpiceCraft</h2>
            <p>At SpiceCraft, we blend tradition and quality to bring you the finest spices. 
                Our commitment to ethical sourcing and superior standards ensures an authentic 
                sensory experience from farm to table.</p>

                <p>Discover the richness of flavors with SpiceCraft. We celebrate heritage, offering an invitation to savor authentic tastes that 
                        transform every meal
                        into a cultural journey. Join us in redefining culinary experiences with every spice blend and almond.</p>
        </div>
        <div className="heor-img">
            <img src="/src/image/about.jpg" alt="" />
        </div>
    </div>
  </section>
 
  <section className='hero'>
    <div className="heading">
        <h1>Our Journey</h1>
    </div>
    <div className="container">
        <div className="hero-content">
            <h2>From Humble Beginnings to a Culinary Legacy</h2>
            <p>SpiceCraft has been dedicated to bringing authentic and high-quality spices to your kitchen. 
             From humble beginnings in a small farm, we've grown into a trusted name in the spice industry, known for our dedication 
             to quality and flavor. </p>

                <p>Over the years, we have expanded our product line and improved our processes, always staying true to our 
             mission of providing the best spices to our customers. Our journey is one of passion, commitment, and a deep 
             respect for the culinary traditions that inspire our products.</p>
        </div>
        <div className="heor-img">
            <img src="/src/image/about2.jpg" alt="" />
        </div>
    </div>
  </section>
 
  <section className='hero'>
    <div className="heading">
        <h1>Our Values</h1>
    </div>
    <div className="container">
        <div className="hero-content">
            <h2>Commitment to Quality and Sustainability</h2>
            <p>At SpiceCraft, our core values drive everything we do. We are committed to delivering the highest quality products 
                while ensuring sustainable and ethical practices. Our partnerships with local farmers ensure that we source the best ingredients 
                while supporting the communities that grow them.</p>

                <p>We believe in transparency, integrity, and respect for the environment. Our goal is to provide you with spices and almonds 
                that not only enhance your meals but also contribute to a healthier planet and a better future for all.</p>
        </div>
        <div className="heor-img">
            <img src="/src/image/about3.jpg" alt="" />
        </div>
    </div>
  </section>
 
  <section className='hero'>
    <div className="heading">
        <h1>Our Vision</h1>
    </div>
    <div className="container">
        <div className="hero-content">
            <h2>Spicing Up Lives Across the Globe</h2>
            <p>Our vision at SpiceCraft is to be a global leader in the spice industry, bringing diverse and rich flavors to kitchens around the world. 
                We aim to inspire culinary creativity and bring people together through the joy of cooking and sharing meals.</p>
                
                <p>As we look to the future, we are excited to continue our journey of innovation and excellence, always striving to exceed the expectations 
                of our customers. Join us as we spice up lives and create memorable culinary experiences for everyone.</p>
        </div>
        <div className="heor-img">
            <img src="/src/image/about4.jpg" alt="" />
        </div>
    </div>
  </section>

  </>
  )
}
