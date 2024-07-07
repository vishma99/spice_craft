import React, { useState } from 'react';
import './spice.css';
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';

const CustomBlendForm = () => {
  const [spiceCount, setSpiceCount] = useState(2);
  const [ingredients, setIngredients] = useState(['', '', '', '']);
  const [weightUnit, setWeightUnit] = useState('mg');
  const [rate, setRate] = useState(['', '', '', '']);
  const [blendName, setBlendName] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSpiceCountChange = (e) => {
    setSpiceCount(e.target.value);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save submitted data
    setSubmittedData({ spiceCount, ingredients, weightUnit, rate, blendName });
    setShowSuccessMessage(true);
  };

  const handleClearForm = () => {
    setSpiceCount(2);
    setIngredients(['', '', '', '']);
    setWeightUnit('mg');
    setRate(['', '', '', '']);
    setBlendName('');
  };

  const handleDelete = () => {
    // Handle delete action
    setSubmittedData(null); // Clear submitted data
    setShowSuccessMessage(false);
  };

  const handleBack = () => {
    // Handle back action
    setShowSuccessMessage(false); // Clear the success message to show the form again
  };

  const handleSave = () => {
    // Handle save action
    alert('Spice blend saved successfully!');
  };

  return (
    <div>
        <NavBar/>
        <div className='countain'>
      {submittedData ? (
        <div className="submitted-details">
          <h2>Submitted Blend Details</h2>
          <p><strong>Blend Name:</strong> {submittedData.blendName}</p>
          <p><strong>Spice Count:</strong> {submittedData.spiceCount}</p>
          <p><strong>Ingredients:</strong> {submittedData.ingredients.join(', ')}</p>
          <p><strong>Weight Unit:</strong> {submittedData.weightUnit}</p>
          <p><strong>Rate:</strong> {submittedData.rate.join(', ')}</p>
          {showSuccessMessage && <p>Spice blend saved successfully!</p>}
          <div className="buttons">
            <button className="back" onClick={handleBack}>Back</button>
            <button className="save" onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <form className="custom-blend-form" onSubmit={handleSubmit}>
          <h2>Custom Blend</h2>
          <label>
            How many types of spices you need?
            <select value={spiceCount} onChange={handleSpiceCountChange}>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </label>
          <label>
            Select ingredients
            <div className="ingredient-dropdowns">
              {Array.from({ length: 4 }, (_, index) => (
                <select
                  key={index}
                  value={ingredients[index]}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                >
                  <option value="">Select Ingredient</option>
                  <option value="Black Pepper">Black Pepper</option>
                  <option value="Darchini (Cinnamon)">Darchini (Cinnamon)</option>
                  <option value="Garam Masala">Garam Masala</option>
                  <option value="Red Chilli Flakes">Red Chilli Flakes</option>
                  <option value="Sookha Dhaniya">Sookha Dhaniya</option>
                  <option value="Turmeric Powder">Turmeric Powder</option>
                  <option value="True Cardamom">True Cardamom</option>
                </select>
              ))}
            </div>
          </label>
          <label>
            Weight need
            <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
              <option value="mg">mg</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
            </select>
          </label>
          <label>
            Rate
            <div className="rate-inputs">
              {rate.map((r, index) => (
                <input
                  key={index}
                  type="number"
                  min="0"
                  value={r}
                  onChange={(e) => handleRateChange(index, e.target.value)}
                />
              ))}
            </div>
          </label>
          <label>
            Give a name
            <input type="text" value={blendName} onChange={(e) => setBlendName(e.target.value)} />
          </label>
          <div className="buttons">
            <button type="button" className="delete" onClick={handleDelete}>Delete</button>
            <button type="button" className="clear" onClick={handleClearForm}>Clear Form</button>
            <button type="submit" className="submit">Submit</button>
          </div>
        </form>
      )}
</div>
      <Footer/>
    </div>
  );
};

export default CustomBlendForm;

