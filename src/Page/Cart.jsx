import React, { useEffect, useState } from "react";
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';
//import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    fetch("http://localhost:8088/cart/1") // Replace 1 with the dynamic customerId
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.log(err));
  };

  const removeItem = (productId) => {
    fetch(`http://localhost:8088/cart/1/${productId}`, {
      // Replace 1 with the dynamic customerId
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => fetchCartItems())
      .catch((err) => console.log(err));
  };  

  return (
    <>
    <NavBar/>
    <div className="container mx-auto mt-10">
      <div className="bg-white shadow-md rounded-lg p-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between border-b-2 py-4"
            >
              <img
                src={`http://localhost:8088/image/${item.photo}`}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1 ml-4 px-3">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>{item.description}</p>
                <p className="text-gray-500">{item.size}</p>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold">${item.price}</span>
                <span className="mx-4">{item.quantity}</span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className=" " style={{backgroundColor:'#A91D3A',color:'#fff',borderRadius:'10px'}}
                 >
                  Remove
                </button>
              </div>
              
            </div>
            
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty</p>
        )}
        
      </div>
      
    </div>
    <Footer/>
    </> 
  );
};

export default Cart;
