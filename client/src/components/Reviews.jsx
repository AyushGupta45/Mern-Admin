import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

const Reviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch("/api/review/getreviews");
        const data = await res.json();

        if (res.ok) {
          setReviews(data.reviews);
        } else {
          toast.error("error fetching");
        }
      } catch (e) {
        toast.error("Error fetching reviews:", e);
      }
    };

    fetchReview();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex(
        (currentIndex) => (currentIndex + 1) % (reviews.length - 2)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [reviews]);

  return (
    <div className="p-2">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">
        Client Testimonials
      </h2>
      <p className="text-lg text-blue-800 mb-8">
        We are dedicated to being your ultimate academic companion. Our
        assignment support services offer top-quality assistance to help you
        excel in your academic journey. With our unwavering commitment to
        excellence and customer satisfaction, we strive to provide dependable
        support for all your assignment needs. Here's what some of our satisfied
        clients have shared about their experience with our services.
      </p>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col justify-between items-center text-center w-full">
          <div>
            <p className="text-lg font-semibold text-gray-700">
              No reviews yet
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews
            .slice(currentReviewIndex, currentReviewIndex + 3)
            .map((review, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg p-10 h-full flex flex-col justify-between items-center text-center w-full transition-opacity duration-500`}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-4">
                    {review.description}
                  </p>
                  <p className="flex justify-center items-center text-yellow-400 gap-x-4">
                    {[...Array(review.stars)].map((_, index) => (
                      <FaStar key={index} size={30} />
                    ))}
                  </p>
                  <div>
                    <p className="text-gray-800 font-bold mt-2">
                      @{review.userId.username}
                    </p>
                    <p className="text-gray-500 text-sm">{`Date: ${new Date(
                      review.createdAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}`}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
