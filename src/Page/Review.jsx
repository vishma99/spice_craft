import React, { useState,useEffect } from 'react';
import axios from "axios";
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';
import { Rating } from "flowbite-react";
import './review.css';

export default function Review() {
    const [data, setData] = useState([]);


    useEffect(() => {
            fetch("http://localhost:8088/reviewVisit")
              .then((res) => res.json())
              .then((data) => setData(data))
              .catch((err) => console.log(err));
          }, []);
        
  const [selectedGender, setSelectedGender] = useState();






  const [values, setValues] = useState({
    name: '',
    comment: '',
    rating: '', // New state to store rating
  });

  const handleInput = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
    setValues({ ...values, rating: event.target.value }); // Update rating in form values
  };

  const handleReview = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8088/review', values)
      .then(res => {
        console.log("Review successfully submitted");
        // Optionally, you can reset the form values after submission
        setValues({
          name: '',
          comment: '',
          rating: '',
        });
        setSelectedGender(null); // Reset radio button selection
      })
      .catch(err => console.error("Error submitting review:", err));
  };

  return (
    <div>
      <NavBar />
      <div className="heading">
        <h1>Review</h1>
      </div>

      <div className="review-profile-container">
        <div className="review-profile-form">
          <h2>Share Your Thoughts: Submit Your Review And Ratings</h2>
          <p>Your review will help us to improve our web hosting quality products, and customer services.</p>

          <form onSubmit={handleReview}>
            <table>
              <tbody>
                <tr>
                  <td>Your Name</td>
                </tr>
                <tr>
                  <td><input type='text' required style={{ width: '100%' }} name='name' value={values.name} onChange={handleInput} /></td>
                </tr>
                <tr>
                  <td>Rate our overall services</td>
                </tr>
                <tr>
                  <td>
                    <label>
                      <input style={{ margin: '10px' }}
                        type="radio"
                        value="1"
                        checked={selectedGender === '1'}
                        onChange={handleGenderChange}
                      />
                      1
                    </label>

                    <label>
                      <input style={{ margin: '10px' }}
                        type="radio"
                        value="2"
                        checked={selectedGender === '2'}
                        onChange={handleGenderChange}
                      />
                      2
                    </label>

                    <label>
                      <input style={{ margin: '10px' }}
                        type="radio"
                        value="3"
                        checked={selectedGender === '3'}
                        onChange={handleGenderChange}
                      />
                      3
                    </label>

                    <label>
                      <input style={{ margin: '10px' }}
                        type="radio"
                        value="4"
                        checked={selectedGender === '4'}
                        onChange={handleGenderChange}
                      />
                      4
                    </label>

                    <label>
                      <input style={{ margin: '10px' }}
                        type="radio"
                        value="5"
                        checked={selectedGender === '5'}
                        onChange={handleGenderChange}
                      />
                      5
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>Write your feedback</td>
                </tr>
                <tr>
                  <td><textarea required style={{ width: '100%', height: '100px' }} name='comment' value={values.comment} onChange={handleInput} /></td>
                </tr>
                <tr>
                  <td>
                    <input type="submit" value="Submit" className="btn save-btn" />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>

      





      <div className="review-profile-container">
      <div className="review-profile-form">
      <h2>Customer Reviews</h2>
      
        {data.length > 0 ? (


          data.map((item) => (

            
            <div

            
              key={item.reviewId}
              className="flex items-center justify-between border-b-2 py-4"
            >
              
              <div className="flex-1 ml-4 px-3">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>{item.comment}</p>
               
                <Rating>
                                        {[...Array(5)].map((_, index) => (
                                            <Rating.Star key={index} filled={index < item.rating} />
                                        ))}
                                    </Rating>
              </div>
            
              
            </div>
            
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty</p>
        )}
        
      </div>
      
    </div>

      <Footer />
    </div>
  );
}
