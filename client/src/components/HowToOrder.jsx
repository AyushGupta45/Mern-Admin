import { paragraphs, steps } from "../constants";
import { Button, Card } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HowToOrder = () => {
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
    <div className="pb-8">
      <div className="mx-auto mb-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
          How to Order Assignment Help Service?
        </h2>

        <div className="flex-1 w-11/12 m-auto">
          <img
            src="/assets/vecteezy_the-teacher-is-explaining-the-lesson-in-class-with-students_4578983.jpg"
            alt="Home"
            className="w-full h-auto mix-blend-multiply"
          />
          <Card className="mx-auto bg-blue-100 hover:shadow-lg transition duration-300 ease-in-out glassy-effect rounded-lg shadow-lg p-6">
            {paragraphs.map((paragraph, index) => (
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

      <div className="w-full">
        <Button
          className="m-auto w-11/12 sm:w-2/6"
          gradientDuoTone="purpleToPink"
          type="submit"
          onClick={handleNavigate}
        >
          Order Now
        </Button>
      </div>

      <hr className="my-8 border-t border-gray-400" />

      <h2 className="text-3xl text-center font-bold text-blue-900 mb-4">
        Writing Service
      </h2>
      <p className="text-lg text-blue-800 mb-4 text-center">
        Ready to get started? Here's how you can order assignments from us:
      </p>
      <p className="text-lg text-blue-800 mb-8 text-center">
        For more details on the ordering and tracking process, feel free to
        contact our customer support team.
      </p>

      <div className="w-full md:w-11/12 grid grid-cols-1 md:grid-cols-1 gap-8 m-auto">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
              {step.title}
            </h3>
            <p className="text-gray-700 text-center">{step.description}</p>
          </div>
        ))}
      </div>

      <p className="text-lg text-blue-800 mt-8 text-center">
        For more details on the ordering and tracking process, feel free to
        contact our customer support team.
      </p>
    </div>
  );
};

export default HowToOrder;
