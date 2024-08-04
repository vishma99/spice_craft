import { useState } from "react";
import "./spice.css";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
// import { useNavigate } from "react-router-dom";
//import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const CustomBlendForm = () => {
  const [spiceCount, setSpiceCount] = useState(2);
  const [ingredients, setIngredients] = useState(["", ""]);
  const [weightUnit, setWeightUnit] = useState("");
  const [weight, setWeight] = useState("");
  const [rate, setRate] = useState(["", ""]);
  const [blendName, setBlendName] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [rateError, setRateError] = useState(false);
  // const navigate = useNavigate();

  const ingredientOptions = [
    "Black Pepper",
    "Darchini (Cinnamon)",
    "Garam Masala",
    "Red Chilli Flakes",
    "Sookha Dhaniya",
    "Turmeric Powder",
    "True Cardamom",
  ];

  const handleSpiceCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setSpiceCount(count);
    setIngredients(Array(count).fill("")); // Adjust ingredients array size
    setRate(Array(count).fill("")); // Adjust rate array size
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleRateChange = (index, value) => {
    const newRate = [...rate];
    newRate[index] = value;
    setRate(newRate);
    validateRates(newRate);
  };

  const validateRates = (rates) => {
    const totalRate = rates.reduce(
      (sum, rate) => sum + parseFloat(rate || 0),
      0
    );
    setRateError(totalRate !== 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rateError) {
      setSubmittedData({
        spiceCount,
        ingredients,
        weightUnit,
        weight,
        rate,
        blendName,
      });
      setShowSuccessMessage(true);
    }
  };

  const handleClearForm = () => {
    setSpiceCount(2);
    setIngredients(["", ""]);
    setWeightUnit("");
    setWeight("");
    setRate(["", ""]);
    setBlendName("");
    setRateError(false);
  };

  const handleBack = () => {
    setSubmittedData(null); // Clear submitted data to go back to the form
    setShowSuccessMessage(false); // Hide success message if any
  };

  // const handleSave = async (event) => {
  //   event.preventDefault();
  //   if (submittedData) {
  //     try {
  //       const response = await axios.post(
  //         `http://localhost:8088/spice/${customerId}`,
  //         submittedData
  //       );
  //       console.log(response.data);
  //       setShowSuccessMessage(true);
  //       setTimeout(() => {
  //         setShowSuccessMessage(false);
  //         navigate("/somewhere"); // navigate to a different page if needed
  //       }, 2000);
  //     } catch (error) {
  //       console.error("Error saving the blend:", error);
  //     }
  //   }
  // };

  const handleSubmiteForm = (e) => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      if (!customerId) {
        Swal.fire({
          title: "Error!",
          text: "You can't add items to the cart without logging in.",
          icon: "error",
          customClass: {
            confirmButton: "swal2-confirm",
          },
        });
        return;
      }
      handleSubmit(e);
      handleSave(); // Call handleSave if customerId is present
    } else {
      Swal.fire({
        title: "Error!",
        text: "You need to log in to submit the form.",
        icon: "error",
        customClass: {
          confirmButton: "swal2-confirm",
        },
      });
    }
  };
  const handleSave = () => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      fetch(`http://localhost:8088/spice/${customerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          spiceCount,
          ingredients,
          weightUnit,
          weight,
          rate,
          blendName,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Failed to fetch cart items: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          console.log(data); // Log response data
          // setShowSuccessMessage(true);

          Swal.fire({
            title: "Success!",
            text: "Spice blend saved successfully!",
            icon: "success",
            customClass: {
              confirmButton: "swal2-confirm",
            },
          });
        })
        .catch((err) => {
          console.error(err); // Log any errors
          setShowSuccessMessage(false);
        });
    }
  };

  return (
    <div>
      <NavBar />
      <div className="countain">
        {submittedData ? (
          <div className="submitted-details">
            <h2>
              <strong>Submitted Blend Details</strong>
            </h2>
            <p>
              <strong>Blend Name:</strong> {submittedData.blendName}
            </p>
            <p>
              <strong>Spice Count:</strong> {submittedData.spiceCount}
            </p>
            <p>
              <strong>Weight:</strong>
              {submittedData.weight} {submittedData.weightUnit}
            </p>

            {/* Ingredients and Rate Table */}
            <table>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Rate (%)</th>
                  <th>RateWeight({submittedData.weightUnit})</th>
                </tr>
              </thead>
              <tbody>
                {submittedData.ingredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td>{ingredient}</td>
                    <td>{submittedData.rate[index]}</td>
                    <td>
                      {(submittedData.rate[index] / 100) * submittedData.weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* {showSuccessMessage && 
          // <p>Spice blend saved successfully!</p>
          } */}
            <div className="buttons">
              <button className="back" onClick={handleBack}>
                Back
              </button>
              <button className="save" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <form className="custom-blend-form">
            <h2>Custom Blend</h2>
            <label>
              How many types of spices do you need?
              <select
                value={spiceCount}
                onChange={handleSpiceCountChange}
                required
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </label>
            <label>
              Weight needed
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                required
              >
                <option value="">Select Unit</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
              </select>
              <input
                type="number"
                required
                name="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </label>

            <label>
              Select ingredients and rate
              <div className="ingredient-dropdowns">
                {Array.from({ length: spiceCount }, (_, index) => (
                  <div key={index}>
                    <select
                      value={ingredients[index]}
                      required
                      onChange={(e) =>
                        handleIngredientChange(index, e.target.value)
                      }
                    >
                      <option value="">Select Ingredient</option>
                      {ingredientOptions
                        .filter(
                          (ingredient) =>
                            !ingredients.includes(ingredient) ||
                            ingredient === ingredients[index]
                        )
                        .map((ingredient) => (
                          <option key={ingredient} value={ingredient}>
                            {ingredient}
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      placeholder="Rate(%)"
                      value={rate[index]}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              {rateError && (
                <p style={{ color: "red" }}>Total rate must be exactly 100%.</p>
              )}
            </label>

            <label>
              Give a name
              <input
                required
                type="text"
                value={blendName}
                onChange={(e) => setBlendName(e.target.value)}
              />
            </label>
            <div className="buttons">
              <button type="button" className="clear" onClick={handleClearForm}>
                Clear Form
              </button>
              <button
                type="submit"
                className="submit"
                disabled={rateError}
                onClick={handleSubmiteForm}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomBlendForm;
