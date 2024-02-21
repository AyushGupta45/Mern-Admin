import React from "react";
import { howtobecomeexpert } from "../constants";
import { Card } from "flowbite-react";

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
      <div className="w-full">
        <img
          src="/assets/Project_66-01.jpg"
          alt="Home"
          className="w-full h-auto md:h-full mix-blend-multiply	m-auto"
        />
      </div>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
  {howtobecomeexpert.map((step, index) => (
    <Card
      key={index}
      className="rounded-lg mx-auto bg-blue-100 shadow-md border border-blue-400 glassy-effect w-11/12 hover:shadow-lg transition duration-300 ease-in-out justify-self-center self-center"
    >
      <div className="flex flex-col h-full justify-center items-center p-4">
        <div className="flex items-center text-blue-900 mb-2">
          <p className="text-3xl font-bold mr-2">
            {React.createElement(step.icon)}
          </p>
          <p className="text-4xl font-bold">{step.percent}</p>
        </div>
        <p className="text-md font-bold text-center">{step.name}</p>
      </div>
    </Card>
  ))}
</div>

    </div>
  );
};

export default Howtobecomeexpert;
