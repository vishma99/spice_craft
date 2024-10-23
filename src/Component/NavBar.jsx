import { useEffect, useState } from "react";
import { Button, Navbar } from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import "../Page/navbar.css";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("token");
    // Clear username state
    setUsername(null);
  };

  return (
    <div>
      <Navbar fluid rounded style={{ paddingBottom: "40px" }}>
        <Navbar.Brand href="">
          <img
            src="/src/image/Logo/logo-no-background.png"
            alt=" "
            style={{
              width: "140px",
              height: "60px",
              paddingLeft: "10px",
              paddingTop: "10px",
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link className="homePage" href="/">
            Home
          </Navbar.Link>
          <Navbar.Link className="homePage" href="/about">
            About Us
          </Navbar.Link>
          <Navbar.Link className="homePage" href="/shop">
            Our Product
          </Navbar.Link>
          <Navbar.Link className="homePage" href="/momspice">
            Spice Blending
          </Navbar.Link>
          <Navbar.Link className="homePage" href="/contact">
            Contact Us
          </Navbar.Link>
          <Navbar.Link className="homePage" href="/cart">
            <i className="fa-solid fa-cart-shopping"></i>
          </Navbar.Link>
        </Navbar.Collapse>

        <div className="flex md:order-2">
          {username ? (
            <span className="username-display">
              <NavDropdown
                className="homePage"
                href="/user"
                title={`Hello, ${username}`}
              >
                <NavDropdown.Item className="homePage" as={Link} to="/user">
                  Profile
                </NavDropdown.Item>

                <NavDropdown.Item className="homePage" onClick={handleLogout}>
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            </span>
          ) : (
            <Button className="button1">
              <a href="/login">Login</a>
            </Button>
          )}
        </div>
      </Navbar>
    </div>
  );
}
