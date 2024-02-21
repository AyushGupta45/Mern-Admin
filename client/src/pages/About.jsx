import React from "react";
import { about } from "../constants";
import { Card } from "flowbite-react";

const About = () => {
  return (
    <div className="bg-blue-100 flex justify-center pb-8" id="about">
      <div className="w-10/12">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
          About Us
        </h1>
        <img
          src="/assets/350_REpWIE1BUiAxNDctMTM.jpg"
          alt="Home"
          className="w-full h-auto mix-blend-multiply"
        />
        <Card className="mx-auto bg-blue-100 hover:shadow-lg transition duration-300 ease-in-out  glassy-effect rounded-lg shadow-lg p-6">
          {about.map((paragraph, index) => (
            <div>
              <h5 className="text-lg text-blue-800 text-start mb-4">
                {React.createElement(paragraph.icon, {
                  className: "inline mr-2 text-blue-600",
                  style: { fontSize: "1.25em" },
                })}
                {paragraph.text}
              </h5>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default About;
