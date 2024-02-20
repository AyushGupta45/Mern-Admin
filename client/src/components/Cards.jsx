import { Card, Button } from "flowbite-react";
import { cardData } from "../constants";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Cards = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!currentUser) {
      return navigate("/sign-in");
    } else {
      navigate("/upload");
    }
  };

  const renderedCards = cardData.map((card, index) => (
    <Card
      key={index}
      className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-blue-400"
    >
      <div className="p-8">
        <h5 className="text-xl font-bold text-blue-900 mb-4 flex justify-center items-center">
          {React.createElement(card.icon, {
            className: "inline mr-2 text-blue-600",
            style: { fontSize: "1.25em" },
          })}
          {card.title}
        </h5>
        <p className="text-gray-700">{card.description}</p>
      </div>
    </Card>
  ));

  return (
    <div>
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="text-4xl font-bold text-blue-900 text-center">
          Elevate Your Academic Journey with Our Services
        </h1>
        <p className="text-center text-2xl text-blue-800">
          Explore our top-notch assistance tailored to meet your academic needs
        </p>
      </div>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {renderedCards}
      </div>
      <div className="w-full">
        <Button
          className="m-auto w-11/12 sm:w-2/6"
          gradientDuoTone="purpleToPink"
          type="submit"
          onClick={handleNavigate}
        >
          Write My Paper Now
        </Button>
      </div>
    </div>
  );
};

export default Cards;
