import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import {
  HiMail,
  HiLockClosed,
  HiUserCircle,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false); // New state to track if verification email is sent
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
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
      return toast.error("Please fill out all fields.");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        return toast.error(data.message);
      }

      if (res.ok) {
        setVerificationSent(true);
        toast.success(
          "Verification email sent successfully. Please check your email inbox."
        );
        navigate("/sign-in");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center ">
      <div className="w-10/12">
        <div className="flex p-3 w-full sm:w-11/12 mx-auto flex-col md:flex-row items-center gap-20 py-20">
          <div className="w-full">
            <Link
              to="/"
              className="font-bold text-4xl flex flex-col justify-center items-center gap-2"
            >
              <img
                src="/assets/logo.jpg"
                alt="Home"
                className="w-36 h-auto md:h-full rounded-full"
              />
              <p className="text-xl text-blue-800">
                MyAssignmentAndProjectHelp
              </p>
            </Link>
            <p className="text-xl text-blue-800 mt-5">
              Welcome to our signup page! Ready to join our community? Sign up
              <span className="font-bold"> now </span>to access exclusive
              features and benefits. With just a few simple steps, you'll be on
              your way to discovering a world of opportunities. Don't miss out!
            </p>
         </div>

          <div className="w-full">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label value="Your Username" />
                <TextInput
                  type="text"
                  icon={HiUserCircle}
                  placeholder="Username"
                  id="username"
                  autoComplete="off"
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
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Password" />
                <div className="relative flex items-center">
                  <TextInput
                    className="flex-1"
                    type={showPassword ? "text" : "password"}
                    icon={HiLockClosed}
                    placeholder="Password"
                    id="password"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
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
            {verificationSent &&
              toast.success(
                "Verification email sent successfully. Please check your email inbox."
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
