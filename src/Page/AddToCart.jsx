import React, { useState } from 'react'
import './addtocart.css';
import NavBar from '../Component/NavBar';
// import FooTer from '../Component/FooTer';


export default function AddToCart() {
    const [count, setCount] = useState(0);
    const [weight, setWeight] = useState(0);

    const increment = ()=>{
        setCount(count + 1);
    };
    const decrement = ()=>{
        setCount(count - 1);
    };
const Weight1 = ()=>{
    setWeight('100g')
}
const Weight2 = ()=>{
    setWeight('250g')
}
const Weight3 = ()=>{
    setWeight('500g')
}



  return (
    <div>
      <NavBar/>
        <div className='container'>
            <section className='about'>
                <div className="about-image">
                    <img src="/src/Image/Shop/Black Pepper.jpg" alt="" />
                </div>
                <div className="about-content">
                    <h2>Black Pepper</h2>
                    <h2>Rs 250-100</h2>
                    <p>Spice Craft’s Black Cardamom (Bari Elaichi): Embrace intense, smoky notes in your culinary creations. 
                        Sourced meticulously, these pods promise a deep, earthy aroma and bold flavors,
                         adding a distinctive essence to your dishes. 
                        Elevate your cooking with this premium spice, perfect for those seeking rich and complex flavors.</p>
                    <h6>Weight : {weight}</h6>
                    <button className='weight' onClick={Weight1}>100g</button> 
                    <button className='weight' onClick={Weight2}>250g</button> 
                    <button className='weight' onClick={Weight3}>500g</button> 
                    <br></br><br></br>
                    <hr />
                    <br></br>   
                        
                        <button onClick={increment}>+</button>
                        <button>{count}</button>
                        <button onClick={decrement}>-</button>

                        <br></br>

                        <hr />
                        
                        <br></br>
                    <a href="" className='read-more'>Add To Card</a>    
                </div>
            </section>


        </div>
        



      {/* <FooTer/> */}
    </div>
  )
}
