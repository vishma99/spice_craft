import React, { useState } from 'react';
import './userprofile.css'; // Import the CSS file for styling
import NavBar from "../Component/NavBar";
import Footer from '../Component/Footer';

function UserProfile() {
  const [selectedGender, setSelectedGender] = useState();

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  return (
    
    <div>
      <NavBar/>
    <div className="user-profile-container">
      {/* <h1>User Profile</h1>
      <h2>Welcome to your profile! Customize it to reflect your unique style and preference.</h2>
      <div className="profile-options">
        <ul style={{ listStyleType: 'circle' }}>
          <li>Personalize Your Profile: Update your photo, and contact details</li>
          <li>Tailor your profile to showcase who you are</li>
          <li>Make it Yours</li>
        </ul>
      </div> */}

      <div className="profile-form">
        <h2>Profile</h2>
        <p>Manage your name and account setting.</p>

        <table>
          <tbody>
            <tr>
              <td>Profile Photo</td>
              <td><input type="file" required /></td>
            </tr>
            <tr>
              <td>Full Name</td>
              <td><input type="text" required /></td>
            </tr>
            <tr>
              <td>Email</td>
              <td><input type="email" required /></td>
            </tr>
            <tr>
              <td>Address</td>
              <td><input type="text" required /></td>
            </tr>
            <tr>
              <td>Phone</td>
              <td><input type="tel" required /></td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>
                <label>
                  <input
                    type="radio"
                    value="male"
                    checked={selectedGender === 'male'}
                    onChange={handleGenderChange}
                  />
                  Male
                </label>

                <label>
                  <input
                    type="radio"
                    value="female"
                    checked={selectedGender === 'female'}
                    onChange={handleGenderChange}
                  />
                  Female
                </label>

                <label>
                  <input
                    type="radio"
                    value="other"
                    checked={selectedGender === 'other'}
                    onChange={handleGenderChange}
                  />
                  Other
                </label>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <input type="submit" value="Cancel" className="btn cancel-btn" />
                <input type="submit" value="Save Changes" className="btn save-btn" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      






    </div>

    
<Footer/>
    </div>
    
  );
}

export default UserProfile;
