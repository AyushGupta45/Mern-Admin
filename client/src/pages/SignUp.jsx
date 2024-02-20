import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { HiMail, HiLockClosed, HiUserCircle } from "react-icons/hi";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false); // New state to track if verification email is sent
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.phonenumber ||
      !formData.email ||
      !formData.password
    ) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        setVerificationSent(true);
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center ">
      <div className="w-10/12">
        <div className="flex p-3 w-9/12 sm:w-11/12 mx-auto flex-col md:flex-row md:items-center gap-20 py-20">
          <div className="flex-1">
            <Link to="/" className="font-bold dark:text-white text-4xl flex justify-center items-center gap-2">
              <img
                src="/asset/logo.png"
                alt="Home"
                className="w-24 h-auto md:h-full"
              />
              <p>MAPhelp</p>
            </Link>
            <p className="text-2xl text-blue-800 mt-5">
              Welcome to our signup page! Ready to join our community? Sign up
              <span className="font-bold"> now </span>to access exclusive
              features and benefits. With just a few simple steps, you'll be on
              your way to discovering a world of opportunities. Don't miss out!
            </p>
          </div>

          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label value="Your Username" />
                <TextInput
                  type="text"
                  icon={HiUserCircle}
                  placeholder="Username"
                  id="username"
                  autoComplete="off"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your PhoneNumber" />
                <TextInput
                  type="text"
                  placeholder="PhoneNumber"
                  id="phonenumber"
                  autoComplete="off"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Email" />
                <TextInput
                  type="email"
                  icon={HiMail}
                  placeholder="Email"
                  id="email"
                  autoComplete="off"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Password" />
                <TextInput
                  type="password"
                  icon={HiLockClosed}
                  placeholder="Password"
                  id="password"
                  autoComplete="off"
                  required
                  onChange={handleChange}
                />
              </div>
              <Button
                gradientDuoTone="purpleToPink"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <p className="pl-3">Loading...</p>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account?</span>
              <Link to="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
            {verificationSent && (
              <Alert className="mt-5" color="success">
                Verification email sent successfully. Please check your email inbox.
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
