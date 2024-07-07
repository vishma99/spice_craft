import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shop from "../Page/Shop";
import Home from "../Page/Home";
import AddtoCard from "../Page/AddToCart";
import Login from "../Page/Login";
import About from "../Page/About";
import Contact from "../Page/Contact";

import Sign from "../Page/Sign";
import Cart from "../Page/Cart";
import Dashboard from "../Page/Dashboard";
import UserProflie from "../Page/UserProflie";
import Review from "../Page/Review";
import AdminLogin from "../Page/AdminLogin";
import Spice from "../Page/Spice";


export default function Spicecraft() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/shop" element={<Shop />}></Route>
          <Route path="/addtocart/:productId" element={<AddtoCard />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>

          <Route path="/sign" element={<Sign />}></Route>
          {/* <Route path="/cart" element={<Cart/>}></Route> */}
          {/* <Route path="/cart/:productId" element={<Cart />}></Route> */}

          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/dash" element={<Dashboard />}> </Route>
          <Route path="/user" element={<UserProflie />}></Route>
          <Route path="/review" element={<Review />}></Route>
          <Route path="/admin" element={<AdminLogin />}></Route>
          <Route path="/spice" element={<Spice />}></Route>
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}
