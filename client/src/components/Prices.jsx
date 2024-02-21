import React from "react";
import { perks, pricingOptions } from "../constants";
import { Card, Button } from "flowbite-react";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Prices = () => {
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
    <div>
      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Benefits of utilizing our writing service includes
      </h2>
      <div className="flex flex-col lg:flex-row gap-6 items-center p-2">
        <div className="grid grid-cols-1 w-full gap-4">
          {perks.map((perk, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-xl font-bold text-blue-900 flex justify-center items-center">
                {React.createElement(perk.icon, {
                  className: "inline mr-2 text-blue-600",
                  style: { fontSize: "1.25em" },
                })}
                {perk.title}
              </div>
              <div className="text-gray-700">{perk.content}</div>
            </div>
          ))}
        </div>

        <Card className="w-full">
          <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
            Price Includes
          </h2>
          <ul>
            {pricingOptions.map((option, index) => (
              <li key={index} className="flex space-x-3 border-b py-2">
                <div className="flex justify-between w-full">
                  <div className="flex gap-2 items-center w-[300px] truncate">
                    <div className="flex items-center">
                      <FaCheckCircle className="h-6 w-6 text-cyan-600" />
                    </div>
                    <span className="text-base font-bold leading-tight truncate text-gray-500">
                      {option.service}
                    </span>
                  </div>
                  <div className="flex gap-4 flex-shrink-0">
                    <p className="line-through">{option.cost}</p>
                    <p className="text-orange-400 font-bold">FREE</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-center mt-4 mb-6 text-2xl font-medium text-gray-500 dark:text-gray-400">
            Get all these features for{" "}
            <span className="line-through font-bold">$65.77</span> FREE
          </p>
          <Button
            gradientDuoTone="purpleToPink"
            type="submit"
            onClick={handleNavigate}
          >
            Write My Assignment
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Prices;
