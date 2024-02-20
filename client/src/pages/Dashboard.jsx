import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashAssignments from "../components/DashAssignments";
import DashPending from "../components/DashPending";
import DashUsers from "../components/DashUsers";
import DashApproved from "../components/DashApproved";
import DashDenied from "../components/DashDenied";
import DashAdminApproved from "../components/DashAdminApproved";
import DashCompleted from "../components/DashCompleted";
import DashUserCompleted from "../components/DashUserCompleted";
import Blogs from "../components/Blogs";
import DashReviews from "../components/DashReviews";


const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="bg-blue-100 min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {tab === "profile" && <DashProfile />}

      {tab === "assignments" && currentUser.isAdmin && <DashAssignments />}

      {tab === "pending" && !currentUser.isAdmin && <DashPending/>}

      {tab === "approved" && !currentUser.isAdmin && <DashApproved/>}

      {tab === "denied" && !currentUser.isAdmin && <DashDenied/>}

      {tab === "usercompleted" && !currentUser.isAdmin && <DashUserCompleted/>}

      {tab === "users" && currentUser.isAdmin && <DashUsers/>}

      {tab === "reviews" && currentUser.isAdmin && <DashReviews/>}

      {tab === "adminapproved" && currentUser.isAdmin && <DashAdminApproved/>}

      {tab === "completed" && currentUser.isAdmin && <DashCompleted/>}

      {tab === "blogs" && currentUser.isAdmin && <Blogs/>}
    </div>
  );
};

export default Dashboard;
