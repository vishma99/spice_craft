import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "../Page/shop.css";

function SpicesCard(props) {
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
        productId: props.productId,
        quantity: 1,
        name: props.product_name,
        price: props.price * 1,
        size: "100g", // Replace with dynamic size as needed
        photo: props.photo,
        description: props.discription,
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
      <div className="card">
        <img src={props.imageCard} alt="" />
        <div className="card-content">
          <h1>{props.name}</h1>
          <p>${props.price}</p>
          <p>100g</p>
          <tr>
            <td>
              <Link
                to={`/addtocart/${props.productId}`}
                className="btn"
                style={{ fontSize: "15px" }}
              >
                SELECT OPTIONS
              </Link>
            </td>
            <td>
              <Link
                className="btn"
                style={{ fontSize: "15px" }}
                onClick={() => handleClick(props.productId)}
                // disabled={product.productId?.quantity}
              >
                Add to card
              </Link>
            </td>
          </tr>
        </div>
      </div>
    </div>
  );
}
export default SpicesCard;
