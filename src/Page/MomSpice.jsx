import React from "react";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import "./momspice.css";

export default function MomSpice() {
  return (
    <div>
      <NavBar />

      <div className="cards">
        <div className="card red">
          <p className="tip">Previous created Spice Blending</p>
          <p className="second-text">Lorem Ipsum</p>
        </div>
        <a href="/spice">
          <div className="card blue">
            <p className="tip">Create new Spice Blending</p>
            <p className="second-text">Lorem Ipsum</p>
          </div>
        </a>
      </div>

      <Footer />
    </div>
  );
}
