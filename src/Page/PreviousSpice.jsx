import { useEffect, useState } from "react";
import axios from "axios";
import "./PreviousSpices.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const PreviousSpices = () => {
  const [spices, setSpices] = useState([]);

  useEffect(() => {
    // Fetch good spice IDs from the backend
    axios
      .post("http://localhost:5000/classify-comments")
      .then((response) => {
        console.log(response.data);
        const outputString = response.data.output;

        // Extract the spice IDs from the output string
        const spiceIdsMatch = outputString.match(/\[([0-9, ]+)\]/); // Find the spice IDs inside square brackets
        let goodSpiceIds = [];

        if (spiceIdsMatch && spiceIdsMatch[1]) {
          // Convert the string of IDs to an array of numbers
          goodSpiceIds = spiceIdsMatch[1]
            .split(",")
            .map((id) => parseInt(id.trim()));
        }

        // Make a request to get the spice details using the good spice IDs
        if (goodSpiceIds.length > 0) {
          axios
            .post("http://localhost:5000/receiveGoodComments", {
              spiceIds: goodSpiceIds,
            })
            .then((response) => {
              if (Array.isArray(response.data)) {
                setSpices(response.data);
              } else {
                console.error("API response is not an array:", response.data);
              }
            })
            .catch((error) => {
              console.error("Error fetching spice details:", error);
            });
        } else {
          console.log("No good spices found");
        }
      })
      .catch((error) => {
        console.error("Error fetching good spice IDs:", error);
      });
  }, []);

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
      <div className="spices-container">
        <div className="heading">
          <h1>Top Reviewed Spices</h1>
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
                  <p>
                    <strong>Comments:</strong> {spice.comment}
                  </p>
                </div>
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
              </div>
            ))
          ) : (
            <p>No spices found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviousSpices;
