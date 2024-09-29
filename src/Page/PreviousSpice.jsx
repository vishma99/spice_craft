import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import "./PreviousSpices.css";
import { Link } from "react-router-dom";

const PreviousSpices = () => {
  const [spices, setSpices] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/previousSpice")
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

  return (
    <div>
      <NavBar />
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
                </div>
                <Link className="btn add-to-cart-btn" to="/cart">
                  Add to Cart
                </Link>
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

export default PreviousSpices;
