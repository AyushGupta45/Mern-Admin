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
      <div className="w-full max-w-4xl mx-auto flex flex-col justify-center items-center">
        <div className="flex justify-center items-center gap-8">
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

        <div className="text-lg text-black mt-4 m-auto">
          <p className="tracking-widest text-center">
            &#169; {new Date().getFullYear()} {`Name Pivate Limited`}
          </p>
        </div>

        <div className="text-md font-bold text-black mt-4 gap-x-10 gap-y-4 grid grid-cols-2 md:grid-cols-4">
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
