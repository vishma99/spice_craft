// import axios from 'axios';
// import React, { useState } from 'react'


// export default function Signup() {

//     // const [data, setData] = useState([])
//     // useEffect(()=> {
//     //     fetch('http://localhost:8084/registercustomer')
//     //     .then(res=> res.json())
//     //     .then(data => setData(data))
//     //     .catch(err => console.log(err));
//     // },[])

// //     const [file, setFile] = useState();
// //     const [data, setData] = useState([])
// //   const handleFile1 = (e) =>{
// //       setFile(e.target.files[0])
// //   }
// //   const  [values, setValues] = useState({
// //     product_name: '',
// //     price: '',
// //     photo: '',
// //     discription: ''

// // })



// // useEffect(()=>{
// // axios.get('http://localhost:8088/')
// // .then(res=> {
// // setData(res.data[0])
// // })
// // .catch(err => console.log(err));
// // },[])
// // const handleInput =  (event) =>{
// //   setValues({...values,[event.target.name]: [event.target.value]})
// // };
// // const handleSubmitSignup = (event) => {
// //   event.preventDefault();
// //   axios.post('http://localhost:8088/upload', values)
// //   .then(res => 
// //        console.log("register successfuly"))
// //       //  navigate('/shop'))
// //        .catch(err => console.log(err));

// //   };

// // const handleFile = () =>{
// //   const formdata = new FormData();
// //   formdata.append('image',file);
// //   axios.post('http://localhost:8088/upload', formdata)
// //   .then(res => {
// //     if(res.data.Status === "Success"){
// //       console.log("Successed")
// //     }
// //     else{
// //       console.log("Failed")
// //     }
// //   })
// //   .catch(err => console.log(err));
// // }

// const [file, setFile] = useState(null); // Initialize file state variable with null

// const handleFile1 = (e) => {
//   setFile(e.target.files[0]); // Set the selected file to the state variable 'file'
// };

// const handleSubmitSignup = (event) => {
//   event.preventDefault();
  
//   // Check if 'file' state is set before calling handleFile
//   if (file) {
//     handleFile(); // Call handleFile to upload image and submit product info together
//   } else {
//     console.log("No file selected.");
//   }
// };

// const handleFile = () => {
//   const formData = new FormData();
//   formData.append('image', file);

//   axios.post('http://localhost:8088/upload/image', formData)
//     .then(res => {
//       if (res.data.filename) {
//         // Once image upload is successful, add image filename to product info
//         const productData = { ...values, photo: res.data.filename };

//         // Now, submit the product info along with the image filename
//         axios.post('http://localhost:8088/upload/data', productData)
//           .then(res => {
//             if (res.data.status === "Success") {
//               console.log("Product uploaded successfully");
//             } else {
//               console.log("Failed to upload product");
//             }
//           })
//           .catch(err => console.log(err));
//       } else {
//         console.log("Failed to upload image");
//       }
//     })
//     .catch(err => console.log(err));
// };




//   return (

// <form action="" onSubmit={handleSubmitSignup}>  



// <input type="text" placeholder='product_name' required name='product_name' onChange={handleFile}/>
// <input type="text" placeholder='price' required name='price' onChange={handleFile}/>
// <input type="text" placeholder='discription' required name='discription' onChange={handleFile}/>




//   <input type="file" onChange={handleFile1}/>
//   <br></br>
//   <button type='submit' name='submit'>upload</button>
//   <br></br>
//   {/* <img src={`http://localhost:8088/image/`+data.photo} alt="" /> */}

// </form>






//     // <div style={{padding: "50px"}}>
//     //   <table>
//     //     <thead>
//     //         <th>id</th>
//     //         <th>name</th>
//     //         <th>email</th>
//     //         <th>contact</th>
//     //         <th>address</th>
//     //         <th>username</th>
//     //         <th>password</th>
//     //     </thead>
//     //     <tbody>
//     //         {data.map((d,i)=>(
//     //             <tr key={i}>
//     //                 <td>{d.customerId}</td>
//     //                 <td>{d.name}</td>
//     //                 <td>{d.email}</td>
//     //                 <td>{d.contactNumber}</td>
//     //                 <td>{d.address}</td>
//     //                 <td>{d.username}</td>
//     //                 <td>{d.password}</td>

//     //             </tr>

//     //         ))}
//     //     </tbody>
//     //   </table>
//     // </div>



//   )
// }
