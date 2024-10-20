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

  const handleAddProduct = async (formData) => {
    try {
      const response = await fetch("http://localhost:8088/addProduct", {
        method: "POST",
        body: formData, // FormData containing the file and other inputs
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        Swal.fire("Success", "Product added successfully!", "success");
        // Optionally refresh the product list or update the UI
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
        fetch(`http://localhost:8088/registerProductAdmin/${productId}`, {
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

    Swal.fire({
      title: "Edit Product",
      html: `
    <form id="editProductForm" class="dash">
      <input type="text" id="product_name" value="${
        product.product_name
      }" placeholder="Product Name" required style="display: block; margin-bottom: 10px; width: 100%;" />
      <input type="number" id="price" value="${
        product.price
      }" placeholder="Price" required style="display: block; margin-bottom: 10px; width: 100%;" />
      <textarea id="discription" placeholder="Description" required style="display: block; margin-bottom: 10px; width: 100%;">${
        product.discription
      }</textarea>
      <input type="file" id="photo" name="photo" style="display: none;" /> <!-- Hide the file input -->
      <div id="imagePreview" style="cursor: pointer; margin-bottom: 10px;"> 
        ${
          product.photo
            ? `<img src="http://localhost:8088/image/${product.photo}" id="currentImage" style="width: 100px; height: 100px; object-fit: cover;" />`
            : ""
        }
      </div>
    </form>
  `,
      showCancelButton: true,
      confirmButtonText: "Update Product",
      didOpen: () => {
        const photoInput = document.getElementById("photo");
        const imagePreview = document.getElementById("imagePreview");

        // Make the image preview clickable, triggering the file input click
        imagePreview.addEventListener("click", () => {
          photoInput.click(); // Trigger file input click when imagePreview is clicked
        });

        // Event listener for when a new file is selected
        photoInput.addEventListener("change", (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              imagePreview.innerHTML = `<img src="${e.target.result}" style="width: 100px; height: 100px; object-fit: cover;" />`;
            };
            reader.readAsDataURL(file); // Read the new image file as a data URL
          }
        });
      },
      preConfirm: () => {
        const product_name = document.getElementById("product_name").value;
        const price = document.getElementById("price").value;
        const discription = document.getElementById("discription").value;
        const photo = document.getElementById("photo").files[0];

        if (!product_name || !price || !discription) {
          Swal.showValidationMessage("Please fill in all fields.");
          return false;
        }

        return {
          product_name,
          price,
          discription,
          photo,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { product_name, price, discription, photo } = result.value;

        // Prepare FormData for the update
        const formData = new FormData();
        formData.append("product_name", product_name);
        formData.append("price", price);
        formData.append("discription", discription);
        if (photo) {
          formData.append("photo", photo);
        }

        // Call your update product function
        handleUpdateProduct(product.productId, formData);
      }
    });
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

  const handleUpdateProduct = async (productId, formData) => {
    try {
      const response = await fetch(
        `http://localhost:8088/updateProduct/${productId}`,
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
            <a href="#" onClick={() => setActiveSection("")}>
              Home
            </a>
          </li>
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
        {activeSection === "" && (
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
        )}
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
              onClick={() => {
                Swal.fire({
                  title: "Add New Product",
                  html: `
          <form id="addProductForm" class="dash">
            <input type="text" id="product_name" name="product_name" placeholder="Product Name" required style="display: block; margin-bottom: 10px; width: 100%;" />
            <input type="number" id="price" name="price" placeholder="Price" required style="display: block; margin-bottom: 10px; width: 100%;" />
            <input type="text" id="discription" name="discription" placeholder="Description" required style="display: block; margin-bottom: 10px; width: 100%;" />
            <input type="file" id="photo" name="photo" style="display: block; margin-bottom: 10px;" />
            
            <div id="imagePreview" style="margin-bottom: 10px;"></div>

          </form>
        `,
                  showCancelButton: true,
                  confirmButtonText: "Add Product",
                  didOpen: () => {
                    const photoInput = document.getElementById("photo");
                    const imagePreview =
                      document.getElementById("imagePreview");

                    photoInput.addEventListener("change", () => {
                      const file = photoInput.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview" style="width: 100px; height: 100px; object-fit: cover;" />`;
                        };
                        reader.readAsDataURL(file);
                      } else {
                        imagePreview.innerHTML = ""; // Clear preview if no file is selected
                      }
                    });
                  },
                  preConfirm: () => {
                    const product_name =
                      document.getElementById("product_name").value;
                    const price = document.getElementById("price").value;
                    const discription =
                      document.getElementById("discription").value;
                    const photo = document.getElementById("photo").files[0];

                    if (!product_name || !price || !discription || !photo) {
                      Swal.showValidationMessage(
                        "Please fill in all fields and select a photo."
                      );
                      return false;
                    }

                    // Pass form data to the handler
                    return {
                      product_name,
                      price,
                      discription,
                      photo,
                    };
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    // Get the form values
                    const { product_name, price, discription, photo } =
                      result.value;

                    // Prepare FormData
                    const formData = new FormData();
                    formData.append("product_name", product_name);
                    formData.append("price", price);
                    formData.append("discription", discription);
                    formData.append("photo", photo);

                    // Call your handleAddProduct function to submit the data
                    handleAddProduct(formData);
                  }
                });
              }}
              style={{ marginBottom: "20px" }}
              type="submit"
            >
              Add Product
            </button>

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
