import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import "./PreviousSpices.css";
import { Link } from "react-router-dom";
import PreviousSpices from "./PreviousSpice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const OldSpice = () => {
  const [spices, setSpices] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/oldSpice")
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
  }, []);

  // Function to handle "Add to Comment" click
  const handleAddComment = (spiceName, spiceId, spiceIndex) => {
    Swal.fire({
      title: `Add a comment for ${spiceName}`,
      input: "textarea",
      inputPlaceholder: "Enter your comment here...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: (comment) => {
        if (!comment) {
          Swal.showValidationMessage("You need to write something!");
        }
        return comment;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const userComment = result.value;

        // Log to ensure the data is being passed
        console.log("Sending spiceId:", spiceId); // Make sure spiceId exists
        console.log("Sending comment:", userComment);

        // Send the spiceId and comment to the backend
        axios
          .post("http://localhost:5000/addComment", {
            spiceId, // spiceId should be passed
            comment: userComment,
          })
          .then((response) => {
            Swal.fire("Submitted!", "Your comment has been added.", "success");

            // Update the spice comments in the frontend
            setSpices((prevSpices) => {
              const updatedSpices = [...prevSpices];
              if (updatedSpices[spiceIndex].comment) {
                updatedSpices[spiceIndex].comment += `\n${userComment}`;
              } else {
                updatedSpices[spiceIndex].comment = userComment;
              }
              return updatedSpices;
            });
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              "There was an issue adding your comment.",
              "error"
            );
            console.error("Error saving comment:", error);
          });
      }
    });
  };

  const handleAddToCart = (spice) => {
    console.log("Spice object:", spice); // Log the spice object to check its fields

    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const customerId = decodedToken.customerId;

        // Destructure the fields from spice
        const { blendName, fullprice, fullWeight, combination } = spice;

        // Check if any required field is missing
        if (!blendName || !fullprice || !fullWeight || !combination) {
          console.error("Missing required fields for the spice blend");
          Swal.fire({
            title: "Error",
            text: "Missing required fields for the spice blend.",
            icon: "error",
          });
          return;
        }

        fetch(`http://localhost:8088/spices/${customerId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            blendName,
            fullprice,
            fullWeight,
            combination,
            customerId,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to save blend: ${res.status} ${res.statusText}`
              );
            }
            return res.json();
          })
          .then((data) => {
            Swal.fire({
              title: "Success!",
              text: "Spice blend is added to cart.",
              icon: "success",
            });
          })
          .catch((err) => {
            console.error("Error:", err);
            Swal.fire({
              title: "Error",
              text: "There was an error adding the spice blend to the cart.",
              icon: "error",
            });
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        Swal.fire({
          title: "Error",
          text: "Invalid token. Please log in again.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Not Logged In",
        text: "You need to log in to add spices to the cart.",
        icon: "warning",
      });
    }
  };

  return (
    <div>
      <NavBar />
      <PreviousSpices />
      <div className="spices-container">
        <div className="heading">
          <h1>Previous Spice Blends</h1>
        </div>

        <div className="spices-grid">
          {spices.length > 0 ? (
            spices.map((spice, index) => (
              <div className="spice-card" key={index}>
                <div className="spice-info">
                  <h3>{spice.name}</h3>
                  <p>
                    <strong>Combination:</strong> {spice.combination}
                  </p>
                  <p>
                    <strong>Full Weight:</strong> {spice.fullWeight}g
                  </p>
                  <p>
                    <strong>Price:</strong> ${spice.price}
                  </p>
                  {/* Display comments under the price */}
                  {spice.comment && (
                    <p>
                      <strong>Comments:</strong> {spice.comment}
                    </p>
                  )}
                </div>
                <table>
                  <tr>
                    <td>
                      <Link
                        className="btn add-to-cart-btn"
                        onClick={() =>
                          handleAddToCart({
                            blendName: spice.name,
                            fullprice: spice.price,
                            fullWeight: spice.fullWeight,
                            combination: spice.combination,
                          })
                        }
                      >
                        Add to Cart
                      </Link>
                    </td>
                    <td>
                      <button
                        className="btn add-to-cart-btn"
                        onClick={() =>
                          handleAddComment(
                            spice.name,
                            spice.spiceId || spice.id,
                            index
                          )
                        } // make sure spice.spiceId exists
                      >
                        Add Comments
                      </button>
                    </td>
                  </tr>
                </table>
              </div>
            ))
          ) : (
            <p>No spices found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OldSpice;
