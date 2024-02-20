<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { HiMail, HiLockClosed, HiUserCircle } from "react-icons/hi";
=======
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [verificationSent, setVerificationSent] = useState(false); // New state to track if verification email is sent
=======
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7
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
<<<<<<< HEAD
        setVerificationSent(true);
=======
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7
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
            {/* <Link to="/" className="font-bold dark:text-white text-4xl">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white mr-2">
                Logo
              </span>
              Name
            </Link> */}
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
<<<<<<< HEAD
                  icon={HiUserCircle}
=======
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7
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
                  addon="+91"
                  placeholder="PhoneNumber"
                  id="phonenumber"
                  autoComplete="off"
<<<<<<< HEAD
=======
                  required
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7
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
<<<<<<< HEAD
            {verificationSent && (
              <Alert className="mt-5" color="success">
                Verification email sent successfully. Please check your email inbox.
              </Alert>
            )}
=======
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
