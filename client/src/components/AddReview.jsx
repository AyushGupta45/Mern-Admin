import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button, Textarea, Label } from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddReview = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ description: "", stars: 3 });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/sign-in");
      toast.error("You must be logged in");
      return;
    }

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: currentUser._id }),
      });

      if (res.ok) {
        setFormData({ description: "", stars: 3 });
        toast.success("Review Added successfully!");
      } else {
        toast.error("Error Creating Review");
      }
    } catch (error) {
      toast.error("Error:", error.message);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
        Add a Review
      </h2>
      <p className="text-lg text-blue-800 mb-8 text-center">
        Share your experience with us!
      </p>
      <div className="w-11/12 sm:w-9/12 m-auto bg-white py-10 px-5 sm:px-10 rounded-lg shadow-md">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="mb-4 flex justify-center items-center flex-col">
              <Label htmlFor="star" value="Rating" className="text-lg" />
              <div className="mb-2"></div>
              <div className="flex gap-x-4">
                {[1, 2, 3, 4, 5].map((starCount) => (
                  <FaStar
                    size={30}
                    key={starCount}
                    id="star"
                    className={`cursor-pointer ${
                      starCount <= formData.stars
                        ? "text-yellow-300"
                        : "text-gray-600"
                    } text-2xl`}
                    onClick={() =>
                      setFormData({ ...formData, stars: starCount })
                    }
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <Label
                htmlFor="description"
                value="Your Review"
                className="text-lg"
              />
              <div className="mb-2"></div>
              <Textarea
                type="text"
                placeholder="Leave a review..."
                required
                id="description"
                className="w-full"
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <Button type="submit" className="mb-4" gradientDuoTone="purpleToPink">
            Add Review
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddReview;
