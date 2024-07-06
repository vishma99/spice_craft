import { useState } from 'react'

import './App.css'

// import NavBar from './Component/NavBar'
// import Footer from './Component/Footer'
// import Login from './Page/Login'
// import Shop from './Page/Shop'

// import AddToCart from './Page/AddToCart'
// import { Route, Routes, Router } from 'react-router-dom'
import Spicecraft from './Routing/Spicecraft';
import Chatbot from './Component/Chatbot';
// import NavBar from './Component/NavBar';
// import Footer from './Component/Footer';

function App() {
  // const [count, setCount] = useState(0)


 



  return (
    <>
   

     {/* <Login/> */}
     {/* <Shop/> */}
     {/* <Home/> */}
     {/* <AddToCart/> */}
     <Spicecraft />
     <Chatbot/>
     
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
