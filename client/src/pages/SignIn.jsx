import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { HiMail, HiLockClosed } from "react-icons/hi";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the filds"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center  ">
      <div className="w-10/12">
        <div className="flex p-3 w-9/12 sm:w-11/12 mx-auto flex-col md:flex-row md:items-center gap-20 py-20">
          <div className="flex-1">
            {/* <Link to="/" className="font-bold dark:text-white text-4xl">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white mr-2">
                Logo
              </span>
              Name
            </Link> */}
            <Link
              to="/"
              className="font-bold dark:text-white text-4xl flex justify-center items-center gap-2"
            >
              <img
                src="/asset/logo.jpg"
                alt="Home"
                className="w-36 h-auto md:h-full rounded-full"
              />
              <p className="text-2xl text-blue-800">
                MyAssignmentAndProjectHelp
              </p>
            </Link>
            <div>
              <p className="text-2xl text-blue-800 mt-5">
                Welcome back to our sign-in page! Already a member?{" "}
                <span className="font-bold">Sign in</span> now to access your
                account.
              </p>
              <p className="mt-3 text-gray-700">
                Don't have an account yet?{" "}
                <span className="font-bold">Sign up</span> now and join our
                community to unlock exclusive features and benefits.
              </p>
            </div>
          </div>

          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                <TextInput
                  type="password"
                  icon={HiLockClosed}
                  placeholder="Password"
                  id="password"
                  autoComplete="off"
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
                  "Sign In"
                )}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Don't have an account?</span>
              <Link to="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
