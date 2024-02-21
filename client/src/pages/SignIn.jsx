import { Button, Label, TextInput, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-hot-toast";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
    if (!formData.email || !formData.password) {
      return toast.error("Please fill all the fields");
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
        toast.error(data.message);
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        toast.success("Sign in successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center">
      <div className="w-10/12">
        <div className="flex p-3 w-full sm:w-11/12 mx-auto flex-col xl:flex-row items-center gap-20 py-20">
          <div className="w-full">
            <Link
              to="/"
              className="font-bold text-4xl flex justify-center items-center gap-2"
            >
              <img
                src="/assets/logo.jpg"
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

          <div className="w-full">
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
                <div className="relative flex items-center">
                  <TextInput
                    className="flex-1"
                    type={showPassword ? "text" : "password"}
                    icon={HiLockClosed}
                    placeholder="Password"
                    id="password"
                    autoComplete="off"
                    onChange={handleChange}
                    required
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
