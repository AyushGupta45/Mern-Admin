import React from "react";
import { about } from "../constants";

const About = () => {
  

  return (
    <div className="bg-blue-100 flex justify-center pb-8" id="about">
      <div className="w-10/12">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
          About Us
        </h1>
        {about.map((paragraph, index) => (
          <p key={index} className="text-lg text-blue-800 mb-6">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default About;
