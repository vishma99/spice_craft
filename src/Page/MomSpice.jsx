import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import "./momspice.css";

export default function MomSpice() {
  return (
    <div>
      <NavBar />

      <div className="cards">
        <a href="/old">
          <div className="card red">
            <p className="tip">Previously created Spice Blending</p>
            <p className="second-text">Discover the trending blendings.</p>
          </div>
        </a>

        <a href="/spice">
          <div className="card blue">
            <p className="tip">Create new Spice Blending</p>
            <p className="second-text">Create and join the collection.</p>
          </div>
        </a>
      </div>

      <Footer />
    </div>
  );
}
