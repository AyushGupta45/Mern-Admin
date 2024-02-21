import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Whatappicon from "./components/Whatappicon";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreateBlogs from "./pages/CreateBlogs";
import UpdateBlogs from "./pages/UpdateBlogs";
import BlogPage from "./pages/BlogPage";
import BlogsUser from "./components/BlogsUser";
import Expert from "./pages/Expert";
import VerifyEmail from "./pages/Verify";


const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Whatappicon/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="/blogs" element={<BlogsUser />} />
        <Route path="/become-an-expert" element={<Expert />} />
        <Route path="/faqs" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-blogs" element={<CreateBlogs />} />
          <Route path="/update-blog/:blogId" element={<UpdateBlogs />} />
        </Route>
        <Route path="/upload" element={<Home />} />
        <Route path="/subjects/:subject" element={<Home />} />
        <Route path="/services/:service" element={<Home />} />
        <Route path="/blog/:blogId" element={<BlogPage />} />

        <Route path="/verify-email/:verificationToken" element={<VerifyEmail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
