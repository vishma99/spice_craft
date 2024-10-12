import { useEffect, useState } from "react";
import axios from "axios";
import "./PreviousSpices.css";
import { Link } from "react-router-dom";

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
                  //onClick={handleAddToCart}
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
