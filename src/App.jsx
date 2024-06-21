import { useState } from 'react'

import './App.css'

// import NavBar from './Component/NavBar'
// import Footer from './Component/Footer'
// import Login from './Page/Login'
// import Shop from './Page/Shop'

// import AddToCart from './Page/AddToCart'
// import { Route, Routes, Router } from 'react-router-dom'
import Spicecraft from './Routing/Spicecraft';
import NavBar from './Component/NavBar';
import Footer from './Component/ Footer';

function App() {
  // const [count, setCount] = useState(0)

  const [show, setShow] = useState(true);
  const [cart, setCart] = useState([]);
 



  return (
    <>
     {/* <NavBar/>
     <Footer/> */}
<NavBar setShow={setShow} size={cart.length} />
     {/* <Login/> */}
     {/* <Shop/> */}
     {/* <Home/> */}
     {/* <AddToCart/> */}
     <Spicecraft />
     <Footer/>
     {/* <Router>
      <Routes>
        <Route>
          
        </Route>
      </Routes>
     </Router> */}
    </>
  )
}

export default App
