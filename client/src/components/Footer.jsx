import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaGithubSquare,
  FaTwitterSquare,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FooterCom() {
  return (
    <div className="bg-blue-200 py-6 gap-4 overflow-hidden">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div>
          <Link
            to="/"
            className="font-bold text-4xl flex flex-col justify-center items-center gap-2"
          >
            <img
              src="/assets/logo.jpg"
              alt="Home"
              className="w-36 h-auto md:h-full rounded-full"
            />
            <p className="text-3xl text-black">MyAssignmentAndProjectHelp</p>
          </Link>
        </div>
        <hr className="w-full border border-gray-800 my-6" />

        <div className="flex justify-center items-center gap-20">
          <div>
            <a href="#" className="text-black text-lg">
              <FaFacebookSquare size={30} />
            </a>
          </div>
          <div>
            <a href="#" className="text-black text-lg">
              <FaInstagramSquare size={30} />
            </a>
          </div>
          <div>
            <a href="#" className="text-black text-lg">
              <FaTwitterSquare size={30} />
            </a>
          </div>
          <div>
            <a href="#" className="text-black text-lg">
              <FaGithubSquare size={30} />
            </a>
          </div>
        </div>
        <hr className="w-full border border-gray-800 my-6" />

        <div className="text-lg text-black m-auto">
          <p className="tracking-widest text-center">
            &#169; {new Date().getFullYear()}{" "}
            {`MyAssignmentAndProjectHelp Pivate Limited`}
          </p>
        </div>
        <hr className="w-full border border-gray-800 my-6" />

        <div className="text-md font-bold text-black gap-x-10 gap-y-4 grid grid-cols-2 md:grid-cols-4">
          <Link
            to="#"
            className="hover:underline m-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Privacy Policy
          </Link>
          <Link
            to="/about"
            className="hover:underline m-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            About
          </Link>
          <Link
            to="#"
            className="hover:underline m-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Terms of Service
          </Link>
          <Link
            to="/become-an-expert"
            className="hover:underline m-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Become An Expert
          </Link>
        </div>
      </div>
    </div>
  );
}
