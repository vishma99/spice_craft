import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Shop from '../Page/Shop'
import Home from '../Page/Home'
import AddtoCard from '../Page/AddToCart'
import Login from '../Page/Login'

export default function Spicecraft() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/home" element={<Home/>}></Route>
          <Route path="/shop" element={<Shop/>}></Route>
          <Route path="/addtocart" element={<AddtoCard/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
