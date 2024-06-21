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
            <p>At SpiceCraft, we blend tradition and quality to bring you the finest spices and handpicked almonds. 
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
 
  </>
  )
}
