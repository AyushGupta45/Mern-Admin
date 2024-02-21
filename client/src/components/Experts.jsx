import { Card } from "flowbite-react";
import React, { useState, useEffect } from "react";

const Experts = () => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await fetch("/api/reg/getexperts");
        if (!response.ok) {
          throw new Error("Failed to fetch experts");
        }
        const data = await response.json();
        setExperts(data.experts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExperts();
  }, []);

  return (
    <>
      {experts.length === 0 ? (
        <h1 className="text-4xl font-bold text-gray-900 text-center mt-8">
          No Experts
        </h1>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {experts.map((expert) => (
            <Card
              key={expert._id}
              className="w-full max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg"
              imgAlt={expert.name}
              imgSrc={expert.uploadLink}
            >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{expert.name}</div>
                <p className="text-gray-700 text-base">{expert.degree}</p>
                <p className="text-gray-700 text-base mt-2">
                  <strong>Specialization: </strong>
                  {expert.specialization.join(", ")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default Experts;
