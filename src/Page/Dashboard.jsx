import { useState, useEffect } from "react";
import Footer from "../Component/Footer";
import AdminNavbar from "../Component/AdminNavbar";

export default function Dashboard() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);

  const [newProduct, setNewProduct] = useState({
    product_name: "",
    price: "",
    discription: "",
    photo: null,
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  useEffect(() => {
    fetch("http://localhost:8088/registercustomerAdmin")
      .then((res) => res.json())
      .then((data1) => setData1(data1))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8088/productAdmin")
      .then((res) => res.json())
      .then((data2) => setData2(data2))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8088/orderAdmin")
      .then((res) => res.json())
      .then((data3) => setData3(data3))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8088/inquiryAdmin")
      .then((res) => res.json())
      .then((data4) => setData4(data4))
      .catch((err) => console.log(err));
  }, []);

  const handleDeleteUser = (customerId) => {
    fetch(`http://localhost:8088/registercustomerAdmin/${customerId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setData1(data1.filter((user) => user.customerId !== customerId));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProduct({ ...newProduct, photo: file });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_name", newProduct.product_name);
    formData.append("price", newProduct.price);
    formData.append("discription", newProduct.discription); // Ensure correct spelling

    // Check if newProduct.photo is a valid File object
    if (newProduct.photo && newProduct.photo instanceof File) {
      formData.append("photo", newProduct.photo); // Ensure photo is correctly appended
    } else {
      console.error("Photo is not a valid file");
      return;
    }

    // Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch("http://localhost:8088/addProduct", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(result);

      if (result.success) {
        // Handle success, e.g., update state or UI
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = (productId) => {
    fetch(`http://localhost:8088/registerProductAdmin/${productId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setData2(data2.filter((product) => product.productId !== productId));
        }
      })
      .catch((err) => console.log(err));
  };
  const handleChangeProduct = (productId) => {
    const product = data2.find((p) => p.productId === productId);
    setEditingProduct(product);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const { productId, productName, price, description } = editingProduct;

    fetch(`http://localhost:8088/updateProduct/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productName, price, description }),
    })
      .then((res) => res.json())
      .then((updatedProduct) => {
        setData2(
          data2.map((p) => (p.productId === productId ? updatedProduct : p))
        );
        setEditingProduct(null);
      })
      .catch(console.error);
  };

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  return (
    <div>
      <AdminNavbar />
      <div
        className="contact-box-container mx-auto"
        style={{ fontWeight: "bold", fontSize: "16px" }}
      >
        <div className="contact-box">
          <h2>No. of customers</h2>
          <h2>{data1.length}</h2>
        </div>

        <div className="contact-box">
          <h2>No. of products</h2>
          <h2>{data2.length}</h2>
        </div>

        <div className="contact-box">
          <h2>No. of orders</h2>
          <h2>{data3.length}</h2>
        </div>
      </div>

      <div style={{ padding: "50px" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            paddingBottom: "30px",
          }}
        >
          Customer
        </h2>
        <hr style={{ paddingBottom: "30px" }} />
        <table style={{ width: "100%", height: "100px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact No</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data1.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.contactNumber}</td>
                <td>{d.address}</td>
                <td>
                  <button onClick={() => handleDeleteUser(d.customerId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "50px" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            paddingBottom: "30px",
          }}
        >
          Product
        </h2>
        <button
          style={{
            backgroundColor: "#A91D3A",
            borderRadius: "10px",
            color: "#fff",
            marginBottom: "20px",
          }}
          onClick={() => setShowAddProductForm(!showAddProductForm)}
        >
          Add Product
        </button>
        {showAddProductForm && (
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              name="product_name"
              onChange={handleInputChange}
              placeholder="Product Name"
              required
            />
            <input
              type="text"
              name="price"
              onChange={handleInputChange}
              placeholder="Price"
              required
            />
            <input
              type="text"
              name="discription"
              onChange={handleInputChange}
              placeholder="discription"
              required
            />
            <input type="file" onChange={handleFileChange} />

            <button type="submit" name="submit">
              Add Product
            </button>
          </form>
        )}
        <hr style={{ paddingBottom: "30px" }} />
        <table style={{ width: "100%", height: "100px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price($)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data2.map((d, i) => (
              <tr key={i}>
                <td>{d.product_name}</td>
                <td>{d.price}</td>
                <td>
                  <button onClick={() => handleDeleteProduct(d.productId)}>
                    Delete
                  </button>
                </td>
                <td>
                  <button onClick={() => handleChangeProduct(d.productId)}>
                    Change
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Form */}
      {editingProduct && (
        <form onSubmit={handleUpdateProduct}>
          <input
            type="text"
            name="product_name"
            value={editingProduct.product_name}
            onChange={handleInputChanges}
          />
          <input
            type="text"
            name="price"
            value={editingProduct.price}
            onChange={handleInputChanges}
          />
          <textarea
            name="discription"
            value={editingProduct.discription}
            onChange={handleInputChanges}
          />
          <img
            src={`http://localhost:8088/image/${editingProduct.photo}`}
            alt={editingProduct.name}
            className="w-20 h-20 object-cover"
          />
          <button type="submit">Update</button>
          <button onClick={() => setEditingProduct(null)}>Cancel</button>
        </form>
      )}

      <div style={{ padding: "50px" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            paddingBottom: "30px",
          }}
        >
          Orders
        </h2>
        <hr style={{ paddingBottom: "30px" }} />
        <table style={{ width: "100%", height: "100px" }}>
          <thead>
            <tr>
              <th>OrderId</th>
              <th>CustomerId</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data3.map((d, i) => (
              <tr key={i}>
                <td>{d.cartId}</td>
                <td>{d.customerId}</td>
                <td>{d.price}</td>
                <td>{d.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "50px" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            paddingBottom: "30px",
          }}
        >
          Inquiry
        </h2>
        <hr style={{ paddingBottom: "30px" }} />
        <table style={{ width: "100%", height: "100px" }}>
          <thead>
            <tr>
              <th>InquiryId</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {data4.map((d, i) => (
              <tr key={i}>
                <td>{d.inquiryId}</td>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.contactNumber}</td>
                <td>{d.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
