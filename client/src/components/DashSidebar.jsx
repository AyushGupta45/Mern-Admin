import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDocumentText } from "react-icons/hi";
import { FaUser, FaCommentAlt } from "react-icons/fa";
import { GrUserExpert } from "react-icons/gr";
import {
  MdPendingActions,
  MdDoneAll,
  MdDone,
  MdClear,
  MdEditDocument,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { sidebarTheme } from "../custometheme";
import toast from "react-hot-toast";

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
      } else {
        dispatch(signoutSuccess());
        toast.success("User Signed Out")
      }
    } catch (error) {}
  };
  return (
    <div className="h-full">
      <Sidebar className="w-full md:w-56" theme={sidebarTheme}>
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-y-1">
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab == "profile"}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>

            {currentUser.isAdmin && (
              <>
                <Link to="/dashboard?tab=blogs">
                  <Sidebar.Item
                    active={tab == "blogs"}
                    icon={MdEditDocument}
                    labelColor="dark"
                    as="div"
                  >
                    Blogs
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=assignments">
                  <Sidebar.Item
                    active={tab == "assignments"}
                    icon={HiDocumentText}
                    labelColor="dark"
                    as="div"
                  >
                    Assignments
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=users">
                  <Sidebar.Item
                    active={tab == "users"}
                    icon={FaUser}
                    labelColor="dark"
                    as="div"
                  >
                    Users
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=experts">
                  <Sidebar.Item
                    active={tab == "users"}
                    icon={GrUserExpert}
                    labelColor="dark"
                    as="div"
                  >
                    Experts
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=reviews">
                  <Sidebar.Item
                    active={tab == "reviews"}
                    icon={FaCommentAlt}
                    labelColor="dark"
                    as="div"
                  >
                    Reviews
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=adminapproved">
                  <Sidebar.Item
                    active={tab === "adminapproved"}
                    icon={MdDone}
                    labelColor="dark"
                    as="div"
                  >
                    Approved
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=completed">
                  <Sidebar.Item
                    active={tab === "completed"}
                    icon={MdDoneAll}
                    labelColor="dark"
                    as="div"
                  >
                    Completed
                  </Sidebar.Item>
                </Link>
              </>
            )}

            {!currentUser.isAdmin && (
              <>
                <Link to="/dashboard?tab=pending">
                  <Sidebar.Item
                    active={tab === "pending"}
                    icon={MdPendingActions}
                    labelColor="dark"
                    as="div"
                  >
                    Pending
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=approved">
                  <Sidebar.Item
                    active={tab === "approved"}
                    icon={MdDone}
                    labelColor="dark"
                    as="div"
                  >
                    Approved
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=denied">
                  <Sidebar.Item
                    active={tab === "denied"}
                    icon={MdClear}
                    labelColor="dark"
                    as="div"
                  >
                    Denied
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=usercompleted">
                  <Sidebar.Item
                    active={tab === "usercompleted"}
                    icon={MdDoneAll}
                    labelColor="dark"
                    as="div"
                  >
                    Completed
                  </Sidebar.Item>
                </Link>
              </>
            )}

            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default DashSidebar;
