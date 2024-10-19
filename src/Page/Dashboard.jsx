import { useState, useEffect } from "react";
import Footer from "../Component/Footer";
import AdminNavbar from "../Component/AdminNavbar";
import "./dashboard.css";
import Swal from "sweetalert2";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState(""); // Track the active section
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
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState(null);

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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8088/registercustomerAdmin/${customerId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.success) {
              setData1(data1.filter((user) => user.customerId !== customerId));
              Swal.fire("Deleted!", "The user has been deleted.", "success");
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProduct({ ...newProduct, photo: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_name", newProduct.product_name);
    formData.append("price", newProduct.price);
    formData.append("discription", newProduct.discription);

    if (newProduct.photo && newProduct.photo instanceof File) {
      formData.append("photo", newProduct.photo);
    } else {
      console.error("Photo is not a valid file");
      return;
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

      if (response.ok) {
        Swal.fire("Success", "Product added successfully!", "success");
        setData2([...data2, result.product]); // Update the product list
      } else {
        Swal.fire("Error", result.error || "Failed to add product", "error");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire("Error", "Failed to add product", "error");
    }
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8088/registercustomerAdmin/${productId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.success) {
              setData2(
                data2.filter((product) => product.productId !== productId)
              );
              Swal.fire("Deleted!", "The product has been deleted.", "success");
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const handleEditProduct = (productId) => {
    const product = data2.find((p) => p.productId === productId);
    setEditingProduct(product);
    setImagePreviews(`http://localhost:8088/image/${product.photo}`);
  };

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleFileChanges = (e) => {
    const file = e.target.files[0];
    setEditingProduct({ ...editingProduct, photo: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_name", editingProduct.product_name);
    formData.append("price", editingProduct.price);
    formData.append("discription", editingProduct.discription);
    formData.append("photo", editingProduct.photo);

    try {
      const response = await fetch(
        `http://localhost:8088/updateProduct/${editingProduct.productId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const updatedProduct = await response.json();

      setData2(
        data2.map((p) =>
          p.productId === updatedProduct.productId ? updatedProduct : p
        )
      );

      setEditingProduct(null);
      setImagePreviews(null);
      Swal.fire("Success", "Product updated successfully!", "success");
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error", "Failed to update product", "error");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <a href="#" onClick={() => setActiveSection("users")}>
              Users
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setActiveSection("products")}>
              Products
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setActiveSection("orders")}>
              Orders
            </a>
          </li>
        </ul>
        <button>Logout</button>
      </div>

      {/* Content Area */}
      <div className="dash">
        <AdminNavbar />
        {activeSection === "users" && (
          <div>
            <h2>Users</h2>
            <table style={{ width: "100%" }}>
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
        )}

        {activeSection === "products" && (
          <div>
            <h2>Products</h2>
            <button
              onClick={() => setShowAddProductForm(!showAddProductForm)}
              style={{ marginBottom: "20px" }}
            >
              Add Product
            </button>

            {showAddProductForm && (
              <form onSubmit={handleAddProduct} className="dash">
                <input
                  type="text"
                  name="product_name"
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  required
                />
                <input
                  type="number"
                  name="price"
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                />
                <input
                  type="text"
                  name="discription"
                  onChange={handleInputChange}
                  placeholder="Description"
                  required
                />
                <input type="file" onChange={handleFileChange} />

                {imagePreview && (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <button type="submit">Add Product</button>
              </form>
            )}

            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data2.map((d, i) => (
                  <tr key={i}>
                    <td>{d.product_name}</td>
                    <td>{d.price}</td>
                    <td>
                      <button onClick={() => handleEditProduct(d.productId)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(d.productId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editingProduct && (
              <form onSubmit={handleUpdateProduct} className="dash">
                <input
                  type="text"
                  name="product_name"
                  value={editingProduct.product_name}
                  onChange={handleInputChanges}
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleInputChanges}
                  required
                />
                <textarea
                  name="discription"
                  value={editingProduct.discription}
                  onChange={handleInputChanges}
                  required
                />
                <input type="file" onChange={handleFileChanges} />

                {imagePreviews && (
                  <div>
                    <img
                      src={imagePreviews}
                      alt="Image Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <button type="submit">Update Product</button>
                <button onClick={() => setEditingProduct(null)}>Cancel</button>
              </form>
            )}
          </div>
        )}

        {activeSection === "orders" && (
          <div>
            <h2>Orders</h2>
            <table style={{ width: "100%" }}>
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
        )}
      </div>

      <Footer />
    </div>
  );
}
