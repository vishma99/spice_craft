import React from "react";
import { Link } from "react-router-dom";
import "../Page/shop.css";

function SpicesCard(props) {
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
              <Link className="btn" style={{ fontSize: "15px" }}>
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
