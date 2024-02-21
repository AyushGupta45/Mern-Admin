import ExpertContent from "../components/ExpertContent";
import ExpertCards from "../components/ExpertCards";
import Howtobecomeexpert from "../components/Howtobecomeexpert";
import ExpertFaq from "../components/ExpertFaq";

const Expert = () => {
  return (
    <div className="bg-blue-100 px-2">
      <div className="m-auto text-center w-full sm:w-9/12 sm:px-0">
        <ExpertContent />
        <hr className="my-8 border-t border-gray-400" />
        <ExpertCards />
        <hr className="my-8 border-t border-gray-400" />
        <Howtobecomeexpert />
        <hr className="my-8 border-t border-gray-400" />
        <ExpertFaq />
      </div>
    </div>
  );
};

export default Expert;
