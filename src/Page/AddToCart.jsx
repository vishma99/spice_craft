import React, { useEffect, useState } from 'react'
import './addtocart.css';
import NavBar from '../Component/NavBar';
import FooTer from '../Component/FooTer';
import { useParams } from 'react-router-dom';



export default function AddToCart() {

    // const [data, setData] = useState([])
    const [count, setCount] = useState(0);
   
//     const [weight, setWeight] = useState(0);

    const increment = ()=>{
        setCount(count + 1);
    };
    const decrement = ()=>{
        if(count>0){
            setCount(count - 1);
        }
        
    };
// const Weight1 = ()=>{
//     setWeight('100g')
// }
// const Weight2 = ()=>{
//     setWeight('250g')
// }
// const Weight3 = ()=>{
//     setWeight('500g')
// }

// useEffect(() => {
//     fetchData();
//   }, []);
// const fetchData = () => {
  
//     fetch('http://localhost:8088/card')
//       .then(res => res.json())
//       .then(data => setData(data))
//       .catch(err => console.log(err));
//   };
  
const { productId } = useParams(); // Get the productId from the URL params
const [product, setProduct] = useState(null);

useEffect(() => {
  fetchData(productId);
}, [productId]);

const fetchData = (productId) => {
  // Fetch product details based on productId
  fetch(`http://localhost:8088/card/${productId}`)
    .then(res => res.json())
    .then(data => 
        // console.log(data))
        setProduct(data))
    .catch(err => console.log(err));
};
const [show, setShow] = useState(true);
  const [cart, setCart] = useState([]);

const handleClick = (product)=>{
  if(cart.indexOf(product) != -1)return;
  setCart([...cart, product])
}


  return (
    <div>
    
    
     
      {product && (
        
     
        <div className='container'>
            <section className='about'>
                <div className="about-image">
                    <img src={`http://localhost:8088/image/${product.photo}`} alt="" />
                </div>
                <div className="about-content">
                    <h2>{product.product_name}</h2>
                    <h2>{product.price}</h2>
                    <p>{product.discription}</p>
                    {/* <h6>Weight : {weight}</h6> */}
                    <h6 style={{padding: '20px 0'}}>Weight : 100g</h6>
                    {/* <button className='weight' onClick={Weight1}>100g</button> 
                    <button className='weight' onClick={Weight2}>250g</button> 
                    <button className='weight' onClick={Weight3}>500g</button>  */}
                   
                    <hr />
                    <br></br>   
                        
                        <button onClick={increment}>+</button>
                        <button>{count}</button>
                        <button onClick={decrement}>-</button>

                       

                       
                        
                        <br></br>
                      
                    <button className='read-more' >Add To Card</button>    
           
                        
                </div>
            </section>


        </div>
        
    )}


      
    </div>
  )
}
