import React from "react";
import { howtobecomeexpert } from "../constants";


const Howtobecomeexpert = () => {
  return (
    <div>
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="text-4xl font-bold text-blue-900 text-center">
          Become a Writer with Us in Five Simple Steps
        </h1>
        <p className="text-center mt-4 text-xl text-blue-800">
          Our team of writers is the backbone of our service, distinguishing us
          from others in the industry. We prioritize our hiring process to
          ensure we maintain the highest standards. To become part of our
          diverse team of experts and fulfill clients' "write my essay" requests
          effectively, follow these steps
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8 p-4">
        {howtobecomeexpert.map((step, index) => (
          <div
            key={index}
            className="flex items-center justify-center p-4 mb-4 rounded-lg bg-gray-100 w-9/12 sm:w-72 h-48 hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center text-blue-900">
                <p className="text-3xl font-bold mr-2">{React.createElement(step.icon)}</p>
                <p className="text-4xl font-bold">{step.percent}</p>
              </div>
              <p className="text-md mt-2 font-bold text-center">{step.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Howtobecomeexpert;
