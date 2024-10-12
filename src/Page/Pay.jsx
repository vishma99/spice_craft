// import axios from "axios";

// // Function to open PayHere for payment processing
// const openPayhere = async (paymentDetails) => {
//   const paymentObject = {
//     sandbox: true, // Set to false in production
//     preapprove: true, // Optional
//     merchant_id: paymentDetails?.merchant_id,
//     return_url: paymentDetails?.return_url,
//     cancel_url: paymentDetails?.cancel_url,
//     notify_url: paymentDetails?.notify_url,
//     order_id: paymentDetails?.order_id,
//     items: paymentDetails?.items,
//     amount: paymentDetails?.amount,
//     currency: paymentDetails?.currency,
//     hash: paymentDetails?.hash,
//     first_name: paymentDetails?.first_name,
//     last_name: paymentDetails?.last_name,
//     email: paymentDetails?.email,
//     phone: paymentDetails?.phone,
//     address: paymentDetails?.address,
//     city: paymentDetails?.city,
//     country: paymentDetails?.country,
//   };

//   // Start payment process
//   window.payhere.startPayment(paymentObject);

//   // Handle payment completion
//   window.payhere.onCompleted = async function () {
//     try {
//       const response = await axios.post("/client/session/payment", {
//         sessionId: paymentDetails?.order_id,
//         paymentId: paymentDetails?.order_id,
//         payment: paymentDetails?.amount,
//       });
//       console.log(response.data);
//       successToast("Payment completed successfully");
//     } catch (error) {
//       console.error("Error confirming payment:", error);
//       errorToast("Failed to confirm payment");
//     }
//   };

//   // Handle dismissed payment
//   window.payhere.onDismissed = function () {
//     errorToast("Payment dismissed");
//   };

//   // Handle payment errors
//   window.payhere.onError = function (error) {
//     console.error("Payment error:", error);
//     errorToast("Payment error");
//   };
// };

// // Submit form and initiate payment process
// const submitForm = async (e) => {
//   e.preventDefault();

//   // Validate form data (example: checking timeSlot and username)
//   if (!formData?.timeSlot || !username) {
//     errorToast("Please fill all required fields");
//     return;
//   }

//   try {
//     // API call to back-end to create the session and get payment details
//     const response = await axios.post("/client/session", {
//       timeSlot: formData?.timeSlot,
//       username,
//     });

//     console.log("Session booked:", response.data);
//     onClose(); // Close the form or modal if necessary

//     // Open PayHere for payment using the data returned from the back-end
//     await openPayhere(response.data?.payment);
//   } catch (error) {
//     console.error("Error booking session:", error);
//     errorToast("Failed to book session");
//   }
// };
