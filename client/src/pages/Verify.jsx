import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

        await response.json();
        if (response.ok) {
          navigate("/sign-in");
        }
      } catch (error) {}
    };

    verifyEmailToken();
  }, [verificationToken]);
};

export default VerifyEmail;
