import React, { useEffect, useState } from 'react'
import './shop.css'
import NavBar from "../Component/NavBar";
import Footer from '../Component/Footer';
import SpicesCard from '../Component/SpicesCard'
import '../Page/shop.css'

// import axios from 'axios';


export default function Shop() {







  const [data, setData] = useState([])
  // useEffect(()=>{
  //   axios.get('http://localhost:8088/')
  //   .then(res=> {
  //   setData(res.data[0])
  //   })
  //   .catch(err => console.log(err));
  //   },[])
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = () => {
    // axios.get('http://localhost:8088/')
    //   .then(res => {
    //     setData(res.data[0]);
    //   })
    //   .catch(err => console.log(err));

    fetch('http://localhost:8088/card')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  };
  
  return (
    <div>
     <NavBar/>

      <div className="heading">
        <h1>Our Product</h1>
    </div>

      <div className="card-container">
      
        {/* <SpicesCard imageCard={`http://localhost:8088/image/`+data.photo}  name={data.map((d, i) => (
    <span key={i}>{d.product_name}</span>
  ))}    price="Rs 250-100"/> */}

       
       
{data.map((d,i)=>(
      <span key={i}>





        <SpicesCard imageCard={`http://localhost:8088/image/${d.photo}`}  name={d.product_name} price={d.price} productId={d.productId} />
        {/* <SpicesCard imageCard="/src/Image/Shop/Sookha Dhaniya (Dried Coriander).jpg" name="Sookha Dhaniya" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Darchini (Cinnamon).jpg" name="Darchini (Cinnamon)" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Garam Masala (Powder).jpg" name="Garam Masala " price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/True Cardamom (Choti Elaichi).jpg" name="True Cardamom" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Turmeric Powder.jpg" name="Turmeric Powder" price="Rs 250-100"/>
        <SpicesCard imageCard="/src/Image/Shop/Garam Masala (Whole).jpg" name="Garam Masala (Whole)" price="Rs 250-100"/> */}

     

</span>
))} 
      </div>
     <Footer/>
    </div>
  )
}
