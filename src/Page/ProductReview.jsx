import { useState, useEffect } from "react";
import axios from "axios";

import { Rating } from "flowbite-react";
import "./review.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// eslint-disable-next-line react/prop-types
export default function ProductReview({ productId }) {
  const [data, setData] = useState([]);
  console.log(productId);

  useEffect(() => {
    if (productId) {
      fetch(`http://localhost:8088/productreviewVisit/${productId}`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));
    }
  }, [productId]);

  const [selectedGender, setSelectedGender] = useState();

  const [values, setValues] = useState({
    name: "",
    comment: "",
    rating: "", // New state to store rating
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

    // Get the JWT token from the cookie
    const token = Cookies.get("token");
    let email = "";

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        email = decodedToken.email;
        console.log(email); // Extract the email from the decoded token
      } catch (err) {
        console.error("Token decoding failed:", err);
        return;
      }
    }

    // Add email to the review values
    const reviewData = {
      ...values,
      email, // Include the extracted email
      productId, // Include the productId
    };

    axios
      .post("http://localhost:8088/productreview", reviewData)
      .then(() => {
        console.log("Review successfully submitted");
        setValues({
          name: "",
          comment: "",
          rating: "",
        });
        setSelectedGender(null);
      })
      .catch((err) => console.error("Error submitting review:", err));
  };

  const handleRatingChange = (ratingValue) => {
    setValues({ ...values, rating: ratingValue }); // Update rating in form values
  };

  return (
    <div>
      <div className="review-profile-container">
        <div className="review-profile-form">
          <h2>Share Your Thoughts: Submit Your Review And Ratings</h2>
          <p>
            Your review will help us to improve our web hosting quality
            products, and customer services.
          </p>

          <form onSubmit={handleReview}>
            <table>
              <tbody>
                <tr>
                  <td>Your Name</td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      required
                      style={{ width: "100%" }}
                      name="name"
                      value={values.name}
                      onChange={handleInput}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Rate our overall services</td>
                </tr>
                <tr>
                  <td>
                    <Rating>
                      {[...Array(5)].map((_, index) => (
                        <Rating.Star
                          key={index}
                          filled={index < values.rating}
                          onClick={() => handleRatingChange(index + 1)}
                          className="cursor-pointer"
                        />
                      ))}
                    </Rating>
                  </td>
                </tr>
                <tr>
                  <td>Write your feedback</td>
                </tr>
                <tr>
                  <td>
                    <textarea
                      required
                      style={{ width: "100%", height: "100px" }}
                      name="comment"
                      value={values.comment}
                      onChange={handleInput}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="submit"
                      value="Submit"
                      className="btn save-btn"
                    />
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
    </div>
  );
}
