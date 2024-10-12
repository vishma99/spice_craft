import { useState, useEffect } from "react";
import Footer from "../Component/Footer";
import AdminNavbar from "../Component/AdminNavbar";
import "./dashboard.css";
import Swal from "sweetalert2";

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

    // Create an image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // This will hold the base64 URL of the image
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

  const handleChangeProduct = (productId) => {
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
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append("product_name", editingProduct.product_name);
    formData.append("price", editingProduct.price);
    formData.append("discription", editingProduct.discription);

    // Only append the file if a new file is uploaded
    //  if (editingProduct.photo && editingProduct.photo instanceof File) {
    formData.append("photo", editingProduct.photo); // Attach the file
    //}

    try {
      const productId = editingProduct.productId; // Get the productId from editingProduct
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

      // Update local state with the new product data
      setData2(
        data2.map((p) =>
          p.productId === updatedProduct.productId ? updatedProduct : p
        )
      );

      // Clear editing state
      setEditingProduct(null);
      setImagePreviews(null);
      if (response.ok) {
        Swal.fire("Success", "Product updated successfully!", "success");
      } else {
        Swal.fire("Error", Error || "Failed to update product", "error");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  const handleDeleteInquiry = (inquiryId) => {
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
        fetch(`http://localhost:8088/inquiryAdmin/${inquiryId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.success) {
              setData4(data4.filter((user) => user.inquiryId !== inquiryId));
              Swal.fire("Deleted!", "The inquiry has been deleted.", "success");
            }
          })
          .catch((err) => console.log(err));
      }
    });
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
              placeholder="Discription"
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
                alt="Preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}

          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingProduct(null)}>
            Cancel
          </button>
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
              <th>Name</th>
              <th>Email</th>

              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data4.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
                <td>{d.email}</td>

                <td>{d.message}</td>
                <td>
                  <button onClick={() => handleDeleteInquiry(d.inquiryId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
