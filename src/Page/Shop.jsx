import React from 'react'
import './shop.css';
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';
import SpicesCard from '../Component/SpicesCard';
import '../Page/shop.css';



export default function Shop() {
 
  
  return (
    <div>
      <NavBar/>

      <div className='pagination' style={{ justifyContent:'center',alignItems:'center', paddingTop:'40px'}}   >
      <h1 style={{position: 'absolute' , fontSize:'30px'}} >Our Product</h1>
      </div>

      <div className="card-container">
      
        <SpicesCard imageCard="/src/Image/Shop/Black Pepper.jpg" name="Black Pepper" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Red Chilli Flakes.jpg" name="Red Chilli Flakes" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Sookha Dhaniya (Dried Coriander).jpg" name="Sookha Dhaniya" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Darchini (Cinnamon).jpg" name="Darchini (Cinnamon)" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Garam Masala (Powder).jpg" name="Garam Masala " price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/True Cardamom (Choti Elaichi).jpg" name="True Cardamom" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Turmeric Powder.jpg" name="Turmeric Powder" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Garam Masala (Whole).jpg" name="Garam Masala (Whole)" price="Rs 250-100"/>

     
      </div>
      <Footer/>
    </div>
  )
}
