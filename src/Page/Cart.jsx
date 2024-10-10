import { useEffect, useState } from "react";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [spices, setSpices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calculate total price whenever cartItems or spices change
  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems, spices]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      axios
        .get(`http://localhost:5000/spiceses/${customerId}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setSpices(response.data);
          } else {
            console.error("API response is not an array:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching previous spices:", error);
        });
    }
  }, []);

  const fetchCartItems = () => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      fetch(`http://localhost:8088/cart/${customerId}`, {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Failed to fetch cart items: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => setCartItems(data))
        .catch((err) => console.log(err));
    }
  };

  const calculateTotalPrice = () => {
    // Calculate the total from cart items
    const cartTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Calculate the total from spice blends
    const spiceTotal = spices.reduce((acc, spice) => acc + spice.price, 0);

    // Set the total price as the sum of both
    setTotalPrice(cartTotal + spiceTotal);
  };

  const removeItem = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("token");
        if (token) {
          fetch(
            `http://localhost:8088/cart/${getCustomerIdFromToken(
              token
            )}/${productId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: token,
              },
            }
          )
            .then((res) => {
              if (!res.ok) {
                throw new Error(
                  `Failed to delete item: ${res.status} ${res.statusText}`
                );
              }
              return res.json();
            })
            .then(() => {
              Swal.fire(
                "Deleted!",
                "Item has been removed from your cart.",
                "success"
              );
              fetchCartItems(); // Update cartItems state after successful delete
            })
            .catch((err) => {
              console.log(err);
              Swal.fire(
                "Error!",
                "Something went wrong while removing the item.",
                "error"
              );
            });
        }
      } else {
        Swal.fire("Cancelled", "Your item is safe in the cart", "info");
      }
    });
  };

  const removeItem1 = (spiceId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8088/spice/${spiceId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.success) {
              setSpices(spices.filter((spices) => spices.spiceId !== spiceId));
              Swal.fire("Deleted!", "The product has been deleted.", "success");
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const getCustomerIdFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.customerId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-10" style={{ minHeight: "39vh" }}>
        <div className="bg-white shadow-md rounded-lg p-6">
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
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
                    <span className="text-lg font-semibold">
                      ${item?.price * item?.quantity}
                    </span>
                    <span className="mx-4">{item.quantity}</span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className=" "
                      style={{
                        backgroundColor: "#A91D3A",
                        color: "#fff",
                        borderRadius: "10px",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {/* Spice Data Display */}
              {spices.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mt-8">
                    Your Spice Blends:
                  </h3>
                  {spices.map((item) => (
                    <div
                      key={item.spiceId} // Use spiceId as the key
                      className="flex items-center justify-between border-b-2 py-4"
                    >
                      <div className="flex-1 ml-4 px-3">
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p>Weight: {item.fullWeight}g</p>
                        <p className="text-lg font-semibold">
                          Price: ${item.price}
                        </p>
                        <button
                          onClick={() => removeItem1(item.spiceId)}
                          className=" "
                          style={{
                            backgroundColor: "#A91D3A",
                            color: "#fff",
                            borderRadius: "10px",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div className="text-right mt-4">
                <h3 className="text-xl font-semibold">
                  Total Price: ${totalPrice.toFixed(2)}
                </h3>
                <div className="flex-1 ml-4 px-3">
                  <button
                    className=" "
                    style={{
                      backgroundColor: "#A91D3A",
                      color: "#fff",
                      borderRadius: "10px",
                    }}
                  >
                    order now
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Your cart is empty</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
