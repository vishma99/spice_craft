import { useState, useEffect } from "react";
import "./spice.css";
import NavBar from "../Component/NavBar";
import Footer from "../Component/Footer";
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
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [ingredientPrices, setIngredientPrices] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:8088/spiceProducts")
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((product) => product.product_name);
        const prices = data.reduce((acc, product) => {
          acc[product.product_name] = product.price;
          return acc;
        }, {});
        setIngredientOptions(options);
        setIngredientPrices(prices);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

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

  const validateForm = () => {
    const errors = {};

    if (!weightUnit) errors.weightUnit = "Weight unit is required.";
    if (!weight) errors.weight = "Weight is required.";
    if (!blendName) errors.blendName = "Blend name is required.";

    ingredients.forEach((ingredient, index) => {
      if (!ingredient)
        errors[`ingredient-${index}`] = `Ingredient ${index + 1} is required.`;
    });
    rate.forEach((rateValue, index) => {
      if (!rateValue)
        errors[`rate-${index}`] = `Rate for ingredient ${
          index + 1
        } is required.`;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        title: "Error!",
        text: "Please fill out all required fields before submitting.",
        icon: "error",
        customClass: {
          confirmButton: "swal2-confirm",
        },
      });
      return;
    }

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
    setFormErrors({});
  };

  const handleBack = () => {
    setSubmittedData(null);
    setShowSuccessMessage(false);
  };
  const handleSubmiteForm = (e) => {
    if (!validateForm()) {
      Swal.fire({
        title: "Error!",
        text: "Please fill out all required fields before submitting.",
        icon: "error",
        customClass: {
          confirmButton: "swal2-confirm",
        },
      });
      return; // Exit if validation fails
    }
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

  //const handleAddToCart = () => {
  // if (!validateForm()) {
  //   Swal.fire({
  //     title: "Error!",
  //     text: "Please fill out all required fields before submitting.",
  //     icon: "error",
  //     customClass: {
  //       confirmButton: "swal2-confirm",
  //     },
  //   });
  //   return; // Exit if validation fails
  // }
  // const token = Cookies.get("token");
  // if (token) {
  //   const decodedToken = jwtDecode(token);
  //   const customerId = decodedToken.customerId;

  //   if (!customerId) {
  //     Swal.fire({
  //       title: "Error!",
  //       text: "You can't add items to the cart without logging in.",
  //       icon: "error",
  //       customClass: {
  //         confirmButton: "swal2-confirm",
  //       },
  //     });
  //     return;
  //   }
  //   handleSubmit(e);
  // handleSave();
  // } else {
  //   Swal.fire({
  //     title: "Error!",
  //     text: "You need to log in to submit the form.",
  //     icon: "error",
  //     customClass: {
  //       confirmButton: "swal2-confirm",
  //     },
  //   });
  // }
  //};

  const handleAddToCart = () => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      const totalPrice = getTotalPrice();

      console.log("Sending data:", {
        spiceCount,
        ingredients,
        weightUnit,
        weight,
        rate,
        blendName,
        fullprice: totalPrice,
      });

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
          fullprice: totalPrice,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Failed to save blend: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          Swal.fire({
            title: "Success!",
            text: "Spice blend is added to cart.",
            icon: "success",
          });
        })
        .catch((err) => {
          console.error("Error:", err);
          setShowSuccessMessage(false);
        });
    }
  };

  const calculatePrice = (ingredient, rate) => {
    const unitPrice = ingredientPrices[ingredient] || 0;
    const ingredientWeight = (rate / 100) * weight;
    return (ingredientWeight * unitPrice) / 100;
  };

  const getTotalPrice = () => {
    return ingredients
      .reduce((total, ingredient, index) => {
        const price = calculatePrice(ingredient, rate[index]);
        if (!isNaN(price)) {
          return total + price;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  return (
    <div>
      <NavBar />
      <div className="countain">
        {submittedData ? (
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                Submitted Blend Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <p className="text-sm">
                  <span className="font-semibold">Blend Name:</span>{" "}
                  {submittedData.blendName}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Spice Count:</span>{" "}
                  {submittedData.spiceCount}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Weight:</span>{" "}
                  {submittedData.weight} {submittedData.weightUnit}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingredient
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate (%)
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RateWeight({submittedData.weightUnit})
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {submittedData.ingredients.map((ingredient, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {ingredient}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {submittedData.rate[index]}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {(
                            (submittedData.rate[index] / 100) *
                            submittedData.weight
                          ).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {calculatePrice(
                            ingredient,
                            submittedData.rate[index]
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-right text-lg font-semibold">
                <span className="font-bold">Total Price:</span> $
                {getTotalPrice()}
              </p>

              <div className="mt-6 flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </button>
              </div>
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
              {formErrors.weight && (
                <span className="error">{formErrors.weight}</span>
              )}
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
                    {formErrors[`ingredient-${index}`] && (
                      <span className="error">
                        {formErrors[`ingredient-${index}`]}
                      </span>
                    )}
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      placeholder="Rate(%)"
                      value={rate[index]}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                    />
                    {formErrors[`rate-${index}`] && (
                      <span className="error">
                        {formErrors[`rate-${index}`]}
                      </span>
                    )}
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
              {formErrors.blendName && (
                <span className="error">{formErrors.blendName}</span>
              )}
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
