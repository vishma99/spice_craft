import { useState } from 'react'

import './App.css'

// import NavBar from './Component/NavBar'
// import Footer from './Component/Footer'
// import Login from './Page/Login'
// import Shop from './Page/Shop'

// import AddToCart from './Page/AddToCart'
// import { Route, Routes, Router } from 'react-router-dom'
import Spicecraft from './Routing/Spicecraft'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     {/* <NavBar/>
     <Footer/> */}

     {/* <Login/> */}
     {/* <Shop/> */}
     {/* <Home/> */}
     {/* <AddToCart/> */}
     <Spicecraft/>

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
