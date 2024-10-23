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
import Das from "../Page/Das";
import PopupChatbox from "../Component/PopupChatbox";
import ProductReview from "../Page/ProductReview";
import MomSpice from "../Page/MomSpice";
import PreviousSpice from "../Page/PreviousSpice";
import Oldspice from "../Page/Oldspice";
import PaymentGateway from "../PaymentGateWay/Payment";

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
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/dash" element={<Dashboard />}>
            {" "}
          </Route>
          <Route path="/user" element={<UserProflie />}></Route>
          <Route path="/review" element={<Review />}></Route>
          <Route path="/admin" element={<AdminLogin />}></Route>
          <Route path="/spice" element={<Spice />}></Route>
          <Route path="/das" element={<Das />}></Route>
          <Route path="productReview" element={<ProductReview />}>
            {" "}
          </Route>
          <Route path="/momspice" element={<MomSpice />}></Route>
          <Route path="previousspice" element={<PreviousSpice />}></Route>
          <Route path="/old" element={<Oldspice />}></Route>
          <Route path="/payment" element={<PaymentGateway />}></Route>
        </Routes>
        <PopupChatbox />
      </BrowserRouter>
    </div>
  );
}
