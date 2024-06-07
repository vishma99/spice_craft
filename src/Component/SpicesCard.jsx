import React from 'react'
import { Link } from 'react-router-dom';
import '../Page/shop.css';

function SpicesCard(props) {
  
  return (
    
    <div>
   
      <div className="card">
          <img src={props.imageCard} alt="" />
          <div className="card-content">
            <h1>
    {props.name}
  </h1>
            <p>{props.price}</p>
           
     
            <Link to={`/addtocart/${props.productId}`} className='btn'>SELECT OPTIONS</Link>
         

          </div>
        </div>

    </div>  
  )
}
export default SpicesCard;
