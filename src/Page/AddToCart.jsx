import { useCallback, useEffect, useState } from "react";
import "./addtocart.css";
import { useParams } from "react-router-dom";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import ProductReview from "./ProductReview";

export default function AddToCart() {
  const [count, setCount] = useState(0);
  const { productId } = useParams(); // Get the productId from the URL params
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");

  const fetchData = useCallback(async (productId, customerId) => {
    // Fetch product details based on productId
    await fetch(
      `http://localhost:8088/card/${productId}${
        customerId ? "/" + customerId : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setCount(data?.quantity || 1);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCustomerId(decodedToken.customerId);
        fetchData(productId, decodedToken?.customerId);
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    } else {
      fetchData(productId, null);
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [fetchData, productId]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleClick = (product) => {
    if (!customerId) {
      Swal.fire({
        title: "Error!",
        text: "You can't add items to the cart without logging in.",
        icon: "error",
        customClass: {
          confirmButton: "swal2-confirm",
        },
      });
      return;
    }

    // if (count === 0) {
    //   Swal.fire({
    //     title: "Error!",
    //     text: "Quantity must be greater than zero.",
    //     icon: "error",
    //     customClass: {
    //       confirmButton: "swal2-confirm",
    //     },
    //   });
    //   return;
    // }

    if (cart.some((item) => item.productId === product.productId)) {
      Swal.fire({
        title: "Info!",
        text: "Item is already in the cart.",
        icon: "info",
        customClass: {
          confirmButton: "swal2-confirm",
        },
      });
      return;
    }

    if (cart.some((item) => item.productId === product.productId)) return;

    fetch("http://localhost:8088/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: customerId, // Replace with dynamic customer ID as needed
        productId: product.productId,
        quantity: count,
        name: product.product_name,
        price: product.price * count,
        size: "100g", // Replace with dynamic size as needed
        photo: product.photo,
        description: product.discription,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart([...cart, { ...product, quantity: count }]);
          Swal.fire({
            title: "Success!",
            text: "Item is added to cart.",
            icon: "success",
            customClass: {
              confirmButton: "swal2-confirm",
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <NavBar />
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
              <h2>${product.price}</h2>
              <p>{product.discription}</p>
              <h6 style={{ padding: "20px 0" }}>Weight : 100g</h6>
              <hr />
              <button
                onClick={decrement}
                disabled={product?.quantity}
                className=" disabled:cursor-not-allowed"
              >
                -
              </button>
              <button disabled>{count}</button>
              <button
                onClick={increment}
                disabled={product?.quantity}
                className=" disabled:cursor-not-allowed"
              >
                +
              </button>

              <br />
              <button
                className="read-more disabled:cursor-not-allowed"
                onClick={() => handleClick(product)}
                disabled={product?.quantity}
              >
                Add To Cart
              </button>
            </div>
          </section>
        </div>
      )}
      <ProductReview productId={productId} />

      <Footer />
    </div>
  );
}
