import "../Page/RareSpices.css";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";

export default function RareSpice() {
  return (
    <>
      <NavBar />
      <section className="hero1">
        <div className="heading1">
          <h1>Rare Spices</h1>
        </div>
        <div className="container1">
          <div className="hero-content1">
            <h2>Discover the World's Rarest Spices</h2>
            <p>
              Explore a curated selection of the rarest and most exquisite
              spices from around the world. These unique spices are treasured
              for their distinct flavors, exotic aromas, and limited
              availability.
            </p>
            <p>
              Whether you're a culinary enthusiast or simply looking to elevate
              your dishes, our rare spices offer an unmatched sensory
              experience. Each spice is sourced from the most exclusive regions
              and meticulously selected to ensure the finest quality.
            </p>
          </div>
          <div className="hero-img1">
            <img src="/src/image/rare.jpg" alt="Rare Spice" />
          </div>
        </div>
      </section>

      <section className="hero1">
        <div className="heading1">
          <h1>Spice: Saffron</h1>
        </div>
        <div className="container1">
          <div className="hero-content1">
            <h2>The World's Most Precious Spice</h2>
            <p>
              Saffron, known for its vibrant color and distinct flavor, is one
              of the rarest and most expensive spices in the world. Harvested by
              hand from the Crocus sativus flower, it is prized for its culinary
              and medicinal properties. Saffron not only enhances the visual
              appeal of dishes but also elevates their flavor profile, making it
              a staple in many cuisines.
            </p>
            <ul>
              <li>
                <strong>Origin:</strong> Iran, India, Spain
              </li>
              <li>
                <strong>Flavor Profile:</strong> Floral, earthy, slightly sweet
              </li>
              <li>
                <strong>Aroma:</strong> Strong and aromatic
              </li>
              <li>
                <strong>Culinary Uses:</strong> Paella, risotto, desserts
              </li>
              <li>
                <strong>Medical Uses:</strong> Mood enhancement, antioxidant
                properties
              </li>
            </ul>
          </div>
          <div className="hero-img1">
            <img src="/src/Image/rare1.jpg" alt="Saffron" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
