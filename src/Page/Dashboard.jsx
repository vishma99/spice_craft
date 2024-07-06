// import React, { useState, useEffect } from "react";
// import NavBar from "../Component/NavBar";
// import Footer from "../Component/Footer";

// export default function Dashboard() {
//   const [data1, setData1] = useState([]);
//   const [data2, setData2] = useState([]);
//   const [data3, setData3] = useState([]);
//   const [data4, setData4] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     productID: "",
//     product_name: "",
//     price: "",
//     photo: null,
//   });
//   const [showAddProductForm, setShowAddProductForm] = useState(false);

//   useEffect(() => {
//     fetch("http://localhost:8088/registercustomerAdmin")
//       .then((res) => res.json())
//       .then((data1) => setData1(data1))
//       .catch((err) => console.log(err));
//   }, []);

//   useEffect(() => {
//     fetch("http://localhost:8088/productAdmin")
//       .then((res) => res.json())
//       .then((data2) => setData2(data2))
//       .catch((err) => console.log(err));
//   }, []);

//   useEffect(() => {
//     fetch("http://localhost:8088/orderAdmin")
//       .then((res) => res.json())
//       .then((data3) => setData3(data3))
//       .catch((err) => console.log(err));
//   }, []);

//   useEffect(() => {
//     fetch("http://localhost:8088/inquiryAdmin")
//       .then((res) => res.json())
//       .then((data4) => setData4(data4))
//       .catch((err) => console.log(err));
//   }, []);

//   const handleDeleteUser = (customerId) => {
//     fetch(`http://localhost:8088/deleteUser/${customerId}`, {
//       method: "DELETE",
//     })
//       .then((res) => res.json())
//       .then((response) => {
//         if (response.success) {
//           setData1(data1.filter((user) => user.customerId !== customerId));
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleAddProduct = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("productID", newProduct.productID);
//     formData.append("product_name", newProduct.product_name);
//     formData.append("price", newProduct.price);
//     formData.append("photo", newProduct.photo);

//     fetch("http://localhost:8088/productAdmin", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((response) => {
//         if (response.success) {
//           setData2([...data2, response.product]);
//           setNewProduct({
//             productID: "",
//             product_name: "",
//             price: "",
//             photo: null,
//           });
//           setShowAddProductForm(false);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct({ ...newProduct, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setNewProduct({ ...newProduct, photo: e.target.files[0] });
//   };

//   return (
//     <div>
//       <NavBar />
//       <div
//         className="contact-box-container mx-auto"
//         style={{ fontWeight: "bold", fontSize: "16px" }}
//       >
//         <div className="contact-box">
//           <h2>No. of customers</h2>
//           <h2>{data1.length}</h2>
//         </div>

//         <div className="contact-box">
//           <h2>No. of products</h2>
//           <h2>{data2.length}</h2>
//         </div>

//         <div className="contact-box">
//           <h2>No. of orders</h2>
//           <h2>{data3.length}</h2>
//         </div>
//       </div>

//       <div style={{ padding: "50px" }}>
//         <h2
//           style={{
//             fontWeight: "bold",
//             fontSize: "18px",
//             paddingBottom: "30px",
//           }}
//         >
//           Customer
//         </h2>
//         <hr style={{ paddingBottom: "30px" }} />
//         <table style={{ width: "100%", height: "100px" }}>
//           <thead>
//             <tr>
//               <th>CustomerId</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Contact No</th>
//               <th>Address</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data1.map((d, i) => (
//               <tr key={i}>
//                 <td>{d.customerId}</td>
//                 <td>{d.name}</td>
//                 <td>{d.email}</td>
//                 <td>{d.contactNumber}</td>
//                 <td>{d.address}</td>
//                 <td>
//                   <button onClick={() => handleDeleteUser(d.customerId)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ padding: "50px" }}>
//         <h2
//           style={{
//             fontWeight: "bold",
//             fontSize: "18px",
//             paddingBottom: "30px",
//           }}
//         >
//           Product
//         </h2>
//         <button
//           style={{
//             backgroundColor: "#A91D3A",
//             borderRadius: "10px",
//             color: "#fff",
//             marginBottom: "20px",
//           }}
//           onClick={() => setShowAddProductForm(!showAddProductForm)}
//         >
//           Add Product
//         </button>
//         {showAddProductForm && (
//           <form onSubmit={handleAddProduct}>
//             <input
//               type="text"
//               name="productID"
//               value={newProduct.productID}
//               onChange={handleInputChange}
//               placeholder="Product ID"
//               required
//             />
//             <input
//               type="text"
//               name="product_name"
//               value={newProduct.product_name}
//               onChange={handleInputChange}
//               placeholder="Product Name"
//               required
//             />
//             <input
//               type="text"
//               name="price"
//               value={newProduct.price}
//               onChange={handleInputChange}
//               placeholder="Price"
//               required
//             />
// <<<<<<< HEAD
//             <input type="file" name="photo" onChange={handleFileChange} required />
// =======
//             <input
//               type="text"
//               name="description"
//               value={newProduct.description}
//               onChange={handleInputChange}
//               placeholder="Description"
//               required
//             />
//             <input
//               type="file"
//               name="photo"
//               onChange={handleFileChange}
//               required
//             />
// >>>>>>> c2c5c3b102f8df630c34e1dee0a2a2b10ffa8933
//             <button type="submit">Add Product</button>
//           </form>
//         )}
//         <hr style={{ paddingBottom: "30px" }} />
//         <table style={{ width: "100%", height: "100px" }}>
//           <thead>
//             <tr>
//               <th>ProductId</th>
//               <th>Name</th>
//               <th>Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data2.map((d, i) => (
//               <tr key={i}>
//                 <td>{d.productId}</td>
//                 <td>{d.product_name}</td>
//                 <td>{d.price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ padding: "50px" }}>
//         <h2
//           style={{
//             fontWeight: "bold",
//             fontSize: "18px",
//             paddingBottom: "30px",
//           }}
//         >
//           Orders
//         </h2>
//         <hr style={{ paddingBottom: "30px" }} />
//         <table style={{ width: "100%", height: "100px" }}>
//           <thead>
//             <tr>
//               <th>OrderId</th>
//               <th>CustomerId</th>
//               <th>Price</th>
//               <th>Quantity</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data3.map((d, i) => (
//               <tr key={i}>
//                 <td>{d.cartId}</td>
//                 <td>{d.customerId}</td>
//                 <td>{d.price}</td>
//                 <td>{d.quantity}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ padding: "50px" }}>
//         <h2
//           style={{
//             fontWeight: "bold",
//             fontSize: "18px",
//             paddingBottom: "30px",
//           }}
//         >
//           Inquiry
//         </h2>
//         <hr style={{ paddingBottom: "30px" }} />
//         <table style={{ width: "100%", height: "100px" }}>
//           <thead>
//             <tr>
//               <th>CustomerId</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Message</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data4.map((d, i) => (
//               <tr key={i}>
//                 <td>{d.customerId}</td>
//                 <td>{d.name}</td>
//                 <td>{d.email}</td>
//                 <td>{d.message}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Footer />
//     </div>
//   );
// }
