import React,{useState,useEffect} from "react";
import { useParams } from 'react-router-dom';


export default function Cart() {
    const [data, setData] = useState([])
   
   
    
    
    const { productId } = useParams(); // Get the productId from the URL params
    const [product, setProduct] = useState(null);
    
    useEffect(() => {
      fetchData(productId);
    }, [productId]);
    
    const fetchData = (productId) => {
      // Fetch product details based on productId
      fetch(`http://localhost:8088/card/${productId}`)
        .then(res => res.json())
        .then(data => 
            // console.log(data))
            setProduct(data))
        .catch(err => console.log(err));
    };
    
  return (
    <div>
      <div style={{ padding: "50px" }}>
        <table >
          <thead >
          <th style={{ padding: "10px" }}>photo</th>
            <th style={{ padding: "10px" }}>product_name</th>
            <th style={{ padding: "10px" }}>price</th>
            <th style={{ padding: "10px" }}>quntity</th>
            <th>totalprice</th>
            
           
            
          </thead>
          <tbody>
            {product && (
              <tr>
                <td><img src={`http://localhost:8088/image/${product.photo}`} style={{padding:'5px', width:'100px', height:'100px'}} alt="" /></td>
                <td>{product.product_name}</td>
                
                
                
                <td>{product.price}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
