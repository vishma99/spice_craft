import React, { useEffect, useState } from "react";
import "./addtocart.css";
import { useParams } from "react-router-dom";
import NavBar from "../Component/NavBar";
import Footer from '../Component/Footer';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";




export default function AddToCart() {
  const [count, setCount] = useState(0);
  const { productId } = useParams(); // Get the productId from the URL params
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    fetchData(productId);
  }, [productId]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCustomerId(decodedToken.customerId);
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    }
  }, []);

  const fetchData = (productId) => {
    // Fetch product details based on productId
    fetch(`http://localhost:8088/card/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  };

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleClick = (product) => {
    if (cart.some((item) => item.productId === product.productId)) return;

    fetch("http://localhost:8088/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId:customerId, // Replace with dynamic customer ID as needed
        productId: product.productId,
        quantity: count,
        name: product.product_name,
        price: product.price*count,
        size: "100g", // Replace with dynamic size as needed
        photo: product.photo,
        description: product.discription,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart([...cart, { ...product, quantity: count }]);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <NavBar/>
      {product && (
        <div className="container">
          <section className="about">
            <div className="about-image">
              <img
                src={`http://localhost:8088/image/${product.photo}`}
                alt={product.product_name}
              />
            </div>
            <div className="about-content">
              <h2>{product.product_name}</h2>
              <h2>{product.price}</h2>
              <p>{product.discription}</p>
              <h6 style={{ padding: "20px 0" }}>Weight : 100g</h6>
              <hr />
              <button onClick={increment}>+</button>
              <button>{count}</button>
              <button onClick={decrement}>-</button>
              <br />
              <button
                className="read-more"
                onClick={() => handleClick(product)}
              >
                Add To Cart
              </button>
              
            </div>
            
          </section>
          
        </div>
        
      )}
      
      <Footer/>
    </div>
  );
}
