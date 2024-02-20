import React from "react";
import { Card } from "flowbite-react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { expertfaqs } from "../constants";

function ExpertFaq() {
  

  const [isOpen, setIsOpen] = React.useState(Array(expertfaqs.length).fill(false));

  const toggleAccordion = (index) => {
    const newIsOpen = Array(expertfaqs.length).fill(false);
    newIsOpen[index] = !isOpen[index];
    setIsOpen(newIsOpen);
  };

  return (
    <div
      className="container mx-auto px-4 pb-8 select-none cursor-pointer"
      id="faq"
    >
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
        FAQ's
      </h1>
      <div className="grid grid-cols-1 gap-4 w-11/12 sm:w-9/12 m-auto">
        {expertfaqs.map((faq, index) => (
          <Card key={index} className="bg-white rounded-lg shadow-lg">
            <div className="p-4" onClick={() => toggleAccordion(index)}>
              <div className="flex justify-between items-center">
                <h3 className="text-md text-start font-semibold">
                  {faq.question}
                </h3>
                <button className="text-black focus:outline-none font-extrabold text-xl">
                  {isOpen[index] ? <BsChevronUp /> : <BsChevronDown />}
                </button>
              </div>
              {isOpen[index] && (
                <p className="text-gray-600 text-start mt-4">{faq.answer}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ExpertFaq;
