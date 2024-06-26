import React from "react";
import Cards from "../components/Cards";
import Reviews from "../components/Reviews";
import Services from "../components/Services";
import HowToOrder from "../components/HowToOrder";
import Content from "../components/Content";
import AddReview from "../components/AddReview";
import DynamicPage from "../components/DynamicPage";
import { useParams } from "react-router-dom";
import About from "./About";
import Upload from "./Upload";
import { useSelector } from "react-redux";
import Faq from "../components/Faq";
import Prices from "../components/Prices";
import DynamicPageServices from "../components/DynamicPageServices";
import Experts from "../components/Experts";


const Home = () => {
  const { subject } = useParams();
  const { service } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  let content;

  if (currentUser && currentUser.isAdmin) {
    return (
      <div className="bg-blue-100">
        <div className="m-auto text-center pt-4 w-full px-10 sm:w-9/12 sm:px-0">
          <Cards />
          <hr className="my-8 border-t border-gray-400" />
          <Reviews />
          <hr className="my-8 border-t border-gray-400" />
          <Services />
          <hr className="my-8 border-t border-gray-400" />
          <HowToOrder />
        </div>
      </div>
    );
  }

  if (subject) {
    content = <DynamicPage />;
  } else if (service) {
    content = <DynamicPageServices />;
  } else if (window.location.pathname === "/upload") {
    content = <Upload />;
  } else {
    content = <Content />;
  }

  return (
    <div className="bg-blue-100">
      <div className="m-auto text-center w-full sm:w-9/12 sm:px-0">
        {content}
        <hr className="my-8 border-t border-gray-400" />
        <Cards />
        <hr className="my-8 border-t border-gray-400" />
        <Experts />
        <hr className="my-8 border-t border-gray-400" />
        <AddReview />
        <hr className="my-8 border-t border-gray-400" />
        <Reviews />
        <hr className="my-8 border-t border-gray-400" />
        <Prices />
        <hr className="my-8 border-t border-gray-400" />
        <Services />
        <hr className="my-8 border-t border-gray-400" />
        <HowToOrder />
        <hr className="my-8 border-t border-gray-400" />
        <Faq />
        <hr className="my-8 border-t border-gray-400" />
        <About />
      </div>
    </div>
  );
};

export default Home;
