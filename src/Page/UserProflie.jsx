import { useState, useEffect } from "react";
import "./userprofile.css";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function UserProfile() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [photo, setPhoto] = useState(null); // Binary photo data (not URL)
  const [photoPreview, setPhotoPreview] = useState(null); // Base64 for image preview
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const customerId = decodedToken.customerId;
        fetchUserData(customerId);
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    }
  }, []);

  const fetchUserData = async (customerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/userprofile/${customerId}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const user = data[0];
        setUsername(user.username);
        setName(user.name);
        setEmail(user.email);
        setAddress(user.address);
        setContactNumber(user.contactNumber);
        setCustomerId(user.customerId);
        setSelectedGender(user.gender || "");

        // Assuming 'photo' is stored as binary or base64 string in the DB
        if (user.photo) {
          setPhoto(user.photo); // Set the base64 photo
          setPhotoPreview(`http://localhost:8088/image/${user.photo}`); // Display the image
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle image file input and generate a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    // Create a preview of the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result); // Set the image preview URL
    };
    if (file) {
      reader.readAsDataURL(file); // Read as base64 for preview
    }
  };

  const handleSaveChanges = async () => {
    const contactNumberPattern = /^[0-9]{10}$/;
    if (!contactNumberPattern.test(contactNumber)) {
      setError("Please enter a valid contact number.");
      return;
    }
    const formData = new FormData();
    formData.append("photo", photo); // Append the file binary
    formData.append("customerId", customerId);
    formData.append("username", username);
    formData.append("address", address);
    formData.append("contactNumber", contactNumber);
    formData.append("gender", selectedGender);
    formData.append("name", name);

    try {
      const response = await fetch("http://localhost:5000/updateUser", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      console.log("Response from server:", result);

      if (response.ok) {
        Swal.fire("Success", "Profile updated successfully!", "success");
      } else {
        Swal.fire("Error", result.error || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="user-profile-container">
        <div className="profile-form">
          <div className="profilename">
            <h2>Profile</h2>
            <p>Manage your name and account settings.</p>
          </div>
          <div className="profile-photo-container">
            <label htmlFor="file-input" className="profile-photo-label">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile Preview"
                  className="profile-photo-preview"
                />
              ) : (
                <div className="profile-photo-placeholder">No Photo</div>
              )}
            </label>
            <input
              type="file"
              id="file-input"
              className="file-input"
              onChange={handleImageChange}
              style={{ display: "none" }} // Hide the actual file input
            />
          </div>
          <div className="emailusername">
            <h1>{email}</h1>
          </div>

          <table>
            <tbody>
              <tr>
                <td>Full Name</td>
                <td>
                  <input
                    className="text"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Username</td>
                <td>
                  <input
                    className="text"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Address</td>
                <td>
                  <input
                    className="text"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>
                  <input
                    type="text"
                    className="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                  {error && <span className="error-message">{error}</span>}
                </td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>
                  <label>
                    <input
                      className="radio"
                      type="radio"
                      value="male"
                      checked={selectedGender === "male"}
                      onChange={(e) => setSelectedGender(e.target.value)}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      className="radio"
                      type="radio"
                      value="female"
                      checked={selectedGender === "female"}
                      onChange={(e) => setSelectedGender(e.target.value)}
                    />
                    Female
                  </label>
                  <label>
                    <input
                      className="radio"
                      type="radio"
                      value="other"
                      checked={selectedGender === "other"}
                      onChange={(e) => setSelectedGender(e.target.value)}
                    />
                    Other
                  </label>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input
                    type="button"
                    value="Cancel"
                    className="btn cancel-btn"
                  />
                  <input
                    type="button"
                    value="Save Changes"
                    className="btn save-btn"
                    onClick={handleSaveChanges}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile;
