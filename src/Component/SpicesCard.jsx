import React from 'react'
import '../Page/shop.css';

function SpicesCard(props) {
  return (
    <div>
      
      <div className="card">
          <img src={props.imageCard} alt="" />
          <div className="card-content">
            <h1>{props.name}</h1>
            <p>{props.price}</p>
            <a href="/addtocart" className='btn'>SELECT OPTIONS</a>
          </div>
        </div>
    </div>  
  )
}
export default SpicesCard;
