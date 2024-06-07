import React,{useState} from 'react'
import axios from 'axios';

export default function Sign() {
  const [name,setName] = useState("");
  const [price,setPrice] = useState("");
  const [discription,setDiscription] = useState("");
  const [file,setFile] = useState();
  const [msg, setMsg] = useState("");

  const upload=()=>{
    const formData = new FormData()
    formData.append("name",name);
    formData.append("price",price);
    formData.append("discription",discription);
    formData.append('file',file)
    axios.post('http://localhost:8088/upload',formData)
    .then((response) => {
      console.log(response);
      if(response.data.Status === "Success"){
        setMsg("File successfully upload");
      }
      else{
        setMsg("error");
      }
    })
    .catch(er => console.log(er))
  }
  return (
    <div>
      <input type="text" placeholder='product_name' required name='product_name' onChange={(e) => setName(e.target.value)}/>
      <input type="text" placeholder='price' required name='price' onChange={(e) => setPrice(e.target.value)}/>
      <input type="text" placeholder='discription' required name='discription' onChange={(e) => setDiscription(e.target.value)}/>
      <input type="file" name='file' onChange={(e) => setFile(e.target.files[0])}/>
      <button type='submit' name='submit' onClick={upload}>upload</button>
      <h1>{msg}</h1>
    </div>
  )
}
