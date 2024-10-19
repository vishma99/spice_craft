/* eslint-disable react/prop-types */
import axios from "axios";

function PaymentGateway({ totalPrice }) {
  const pay = async () => {
    // return if payment less than 30
    if (totalPrice < 30) {
      return;
    }
    axios
      .post("http://localhost:8088/payment", {
        price: totalPrice,
      })
      .then((response) => {
        const responseData = response.data;

        if (response) {
          // Prepare the payment object
          const paymentDetails = {
            sandbox: true,
            merchant_id: responseData.merchantId,
            return_url: responseData.return_url,
            cancel_url: responseData.cancel_url,
            notify_url: responseData.notify_url,
            first_name: responseData.first_name,
            last_name: responseData.last_name,
            email: responseData.email,
            phone: responseData.phone,
            address: responseData.address,
            city: responseData.city,
            country: responseData.country,
            order_id: responseData.orderId,
            items: responseData.items,
            amount: responseData.amount,
            currency: responseData.currency,
            hash: responseData.hash,
          };
          window.payhere.startPayment(paymentDetails);

          // Payment event handlers
          window.payhere.onCompleted = function (orderId) {
            console.log("Payment completed. OrderID:", orderId);
            // Note: validate the payment and show success or failure page to the customer
          };

          window.payhere.onDismissed = function () {
            console.log("Payment dismissed");
            // Note: Prompt user to pay again or show an error page
          };

          window.payhere.onError = function (error) {
            console.log("Error:", error);
            // Note: show an error page
          };
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <button onClick={pay} className="btn-ServiceProvider-1 px-1">
      Pay with Payhere
    </button>
  );
}

export default PaymentGateway;
