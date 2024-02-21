import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import DropdownSub from "./Dropdown";
import DropdownServices from "./DropdowServices";
import { headerTheme } from "../custometheme";

const Header = () => {
  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 30;
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {}
  };

  return (
    <Navbar
      className="border-b-2 bg-blue-200 py-4 sticky top-0 left-0 w-full z-10"
      theme={headerTheme}
    >
      <Link
        to="/"
        className="whitespace-nowrap text-sm sm:text-xl font-semibold gap-2 flex items-center justify-center "
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img
          src="/assets/logo.jpg"
          alt="Home"
          className="w-14 h-auto md:h-full rounded-full"
        />
        <p className="text-lg text-blue-800 hidden xl:block">
          MyAssignmentAndProjectHelp
        </p>
      </Link>

      <div className="flex gap-4 lg:order-2 items-center">
        {currentUser ? (
          <>
            <Navbar.Link
              active={location.pathname.startsWith("/dashboard")}
              as={"div"}
              className="font-bold text-md lg:text-lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Link to="/dashboard?tab=profile">Profile</Link>
            </Navbar.Link>

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded />
              }
            >
              <Dropdown.Item
                onClick={handleSignout}
                className="text-base text-red-500 hover:text-red-600"
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/sign-in">
              <Button
                gradientDuoTone="purpleToBlue"
                outline
                className="text-lg font-bold"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button
                gradientDuoTone="purpleToBlue"
                className="text-lg font-bold"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
        <Navbar.Toggle />
      </div>

      {!currentUser || !currentUser.isAdmin ? (
        <Navbar.Collapse>
          <Navbar.Link
            active={path === "/"}
            as={"div"}
            className="font-bold text-md lg:text-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/">Home</Link>
          </Navbar.Link>

          <Navbar.Link
            as={"div"}
            active={location.pathname.startsWith("/services")}
            className="font-bold text-md lg:text-lg"
          >
            <DropdownServices />
          </Navbar.Link>
          <Navbar.Link
            as={"div"}
            active={location.pathname.startsWith("/subjects")}
            className="font-bold text-md lg:text-lg"
          >
            <DropdownSub />
          </Navbar.Link>

          <Navbar.Link
            active={path === "/blogs"}
            as={"div"}
            className="font-bold text-md lg:text-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/blogs">Blogs</Link>
          </Navbar.Link>

          <Navbar.Link
            active={path === "/upload"}
            as={"div"}
            className="font-bold text-md lg:text-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/upload">Upload</Link>
          </Navbar.Link>

          <Navbar.Link
            active={path === "/faqs"}
            as={"div"}
            className="font-bold text-md lg:text-lg"
            onClick={() => {
              scrollToElement("faq");
            }}
            // onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/faqs">FAQ's</Link>
          </Navbar.Link>
          <Navbar.Link
            active={path === "/about"}
            as={"div"}
            className="font-bold text-md lg:text-lg"
            onClick={() => {
              scrollToElement("about");
            }}
            // onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/about">About</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      ) : null}

      {currentUser && currentUser.isAdmin ? (
        <Navbar.Collapse>
          <Navbar.Link
            active={path === "/"}
            as={"div"}
            className="font-bold text-md lg:text-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link
            active={path === "/dashboard?tab=blogs"}
            as={"div"}
            className="font-bold text-md lg:text-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/dashboard?tab=blogs">Blogs</Link>
          </Navbar.Link>

          <Navbar.Link
            active={path === "/create-blogs"}
            as={"div"}
            className="font-bold text-md lg:text-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Link to="/create-blogs">Create Blog</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      ) : null}
    </Navbar>
  );
};

export default Header;
