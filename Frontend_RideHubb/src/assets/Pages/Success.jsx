import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {base64Decode} from "esewajs"
import axios from "axios";
const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // Create a new URLSearchParams object using the search string from location
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");
  // Decode the JWT without verifying the signature
  const decoded = base64Decode(token);
  const verifyPaymentAndUpdateStatus = async () => {
    try {
      if (!token) {
        console.error("No data token found in URL");
        setIsLoading(false);
        return;
      }

      console.log("Processing payment verification for transaction:", decoded.transaction_uuid);
   
      const response = await axios.post(
        "http://localhost:5000/payment-status",
        {
          product_id: decoded.transaction_uuid,
        }
      );
      
      console.log("Payment verification response:", response.data);
      
      if (response.data.success) {
        setIsLoading(false);
        setIsSuccess(true);
      } else {
        setIsLoading(false);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setIsLoading(false);
      setIsSuccess(false);
    }
  };
  
  useEffect(() => {
    verifyPaymentAndUpdateStatus();
  }, []);
  if (isLoading && !isSuccess) return <>Loading...</>;
  if (!isLoading && !isSuccess)
    return (
      <>
        <h1>Oops!..Error occurred on confirming payment</h1>
        <h2>We will resolve it soon.</h2>
        <button onClick={() => navigate("/")} className="go-home-button">
          Go to Homepage
        </button>
      </>
    );
  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Your transaction was successful.</p>
      <button onClick={() => navigate("/")} className="go-home-button">
        Go to Homepage
      </button>
    </div>
  );
};
export default Success;