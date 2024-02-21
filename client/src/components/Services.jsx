import { services } from "../constants";
import { Card, Button } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!currentUser) {
      return navigate("/sign-in");
    } else {
      navigate("/upload");
    }
  };
  return (
    <div className="pb-8 p-2">
      <div className="flex flex-col items-center gap-y-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
          Assignment Help Services
        </h2>
        <p className="text-lg text-blue-800 text-center">
          Explore our reliable and trustworthy assignment help services
          connecting students to top professional writers. Our experts possess
          extensive subject knowledge to provide tailored assistance.
        </p>
        <hr className="w-11/12 sm:w-9/12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-white rounded-lg shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="w-full">
        <Button
          className="m-auto w-11/12 sm:w-2/6"
          gradientDuoTone="purpleToPink"
          type="submit"
          onClick={handleNavigate}
        >
          Get Help
        </Button>
      </div>
    </div>
  );
};

export default Services;
