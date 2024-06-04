import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shop from '../Page/Shop'
import Home from '../Page/Home'
import AddtoCard from '../Page/AddToCart'
import Login from '../Page/Login'
import About from "../Page/About";
import Contact from "../Page/Contact";
import Signup from "../Page/Signup";


export default function Spicecraft() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/home" element={<Home/>}></Route>
          <Route path="/shop" element={<Shop/>}></Route>
          <Route path="/addtocart" element={<AddtoCard/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path="/contact" element={<Contact/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}
