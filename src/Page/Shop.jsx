import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./shop.css";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import SpicesCard from "../Component/SpicesCard";
import "../Page/shop.css";

export default function Shop() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000); // Default max price
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchQuery(query);
  }, [location.search]);

  const fetchData = () => {
    fetch("http://localhost:8088/card")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const filteredData = data.filter(
    (d) =>
      d.product_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      d.price <= maxPrice
  );

  return (
    <div>
      <NavBar />

      <div className="heading">
        <h1>Our Product</h1>
      </div>

      <div className="filter-container" style={{ paddingLeft: "50px" }}>
        <input
          type="text"
          placeholder="Search for spices..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="priceranges">
          <label htmlFor="priceRange">Max Price: $ {maxPrice}</label>
          <input
            type="range"
            id="priceRange"
            min="0"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={handlePriceChange}
          />
        </div>
      </div>

      <div className="card-container">
        {filteredData.length > 0 ? (
          filteredData.map((d, i) => (
            <span key={i}>
              <SpicesCard
                imageCard={`http://localhost:8088/image/${d.photo}`}
                name={d.product_name}
                price={d.price}
                productId={d.productId}
              />
            </span>
          ))
        ) : (
          <p style={{ fontSize: "30px", marginBottom: "120px" }}>
            No products found.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
