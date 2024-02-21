import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const response = await fetch(
          `/api/auth/verify-email/${verificationToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          toast.success("Email verified successfully! You can now sign in.");
          navigate("/sign-in");
        } else {
          toast.error(data.message || "Failed to verify email. Please try again.");
          navigate("/sign-in")
        }
      } catch (error) {
        toast.error("An error occurred while verifying email. Please try again.");
      }
    };

    verifyEmailToken();
  }, [verificationToken, navigate]);

  return null;
};

export default VerifyEmail;
