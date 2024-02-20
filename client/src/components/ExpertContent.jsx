import { Button } from "flowbite-react";

const ExpertContent = () => {
  return (
    <div className="container w-full mx-auto flex flex-col justify-center items-center py-10 lg:flex-row gap-4">
      <div className="flex w-full lg:w-1/2 flex-col sm:flex-row gap-4 items-center p-4">
        <div className="max-w-lg mx-auto bg-transparent p-6 rounded-lg">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-4">
            Discover the World of Essay Writing and Enjoy Countless Benefits!
          </h2>
          <p className="text-center text-xl text-blue-800 mb-8">
            Unlock your potential as an essay writer and explore a myriad of
            opportunities that await you.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <p className="mb-2 text-sm font-bold">Set Your Price</p>
            <p className="mb-2 text-sm font-bold">Vast Customer Base</p>
            <p className="mb-2 text-sm font-bold">Personalized Support</p>
            <p className="mb-2 text-sm font-bold">Choose Assignments</p>
            <p className="mb-2 text-sm font-bold">Prompt Payments</p>
            <p className="mb-2 text-sm font-bold">And Much More!</p>
          </div>

          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfQfgNPYE3zWj1JL0yt09L8VBee1-MXnvg1RLfuNVRwKe7uuA/viewform?vc=0&c=0&w=1&flr=0 ">
            <Button
              className="m-auto w-9/12 mt-8"
              gradientDuoTone="purpleToPink"
              type="submit"
            >
              Become An Expert Now
            </Button>
          </a>
        </div>
      </div>{" "}
      <div>
        <img
          src="/asset/home.svg"
          alt="Home"
          className="w-full h-auto md:h-full transform scale-x-[-1]"
        />
      </div>
    </div>
  );
};

export default ExpertContent;
