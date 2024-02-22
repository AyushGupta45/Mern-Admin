import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (currentIndex) => (currentIndex + 1) % (experts.length - 2)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [experts]);

  return (
    <div className="p-2">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">
        Meet Our Expert Team
      </h2>
      <p className="text-lg text-blue-800 mb-8">
        Our expert team comprises skilled professionals in the field of
        technology, each bringing a wealth of knowledge and experience. From
        software engineering to data science, cybersecurity to web development,
        our experts excel in diverse specializations. With their passion for
        innovation and problem-solving, they are dedicated to delivering
        top-notch solutions that meet your needs. Explore our team below and
        discover the expertise that drives our success.
      </p>

      {experts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col justify-between items-center text-center w-full">
          <div>
            <p className="text-lg font-semibold text-gray-700">No Experts</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experts
            .slice(currentIndex, currentIndex + 3)
            .map((expert, index) => (
              <div
                key={index}
                className={`bg-white m-auto rounded-lg shadow-lg p-6 h-full flex flex-col justify-between items-center text-center w-full`}
              >
                <img
                  src={expert.uploadLink || "https://via.placeholder.com/150"}
                  alt={expert.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-2"
                />
                
                <div className="font-bold text-xl mb-2">{expert.name}</div>

                <div className="text-gray-700 text-base mb-2">
                  {expert.degree}
                </div>

                <div className="flex justify-center mb-2 items-center text-yellow-400 gap-x-1">
                  {[...Array(expert.stars || 0)].map((_, index) => (
                    <FaStar key={index} size={30} />
                  ))}
                  {expert.stars === undefined && (
                    <span>No rating available</span>
                  )}
                </div>

                <p className="text-gray-700">
                  <strong>Specialization: </strong>
                  {expert.specialization.join(", ")}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Experts;
