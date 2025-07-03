import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import assets from "../../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
  const location = useLocation();
  const IsCourseListPage = location.pathname.includes("/course-list");
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      } else {
        const token = await getToken();
        // ✅ Updated API endpoint - you can choose either one:
        // Option 1: Use the educator route
        const { data } = await axios.patch(
          backendUrl + "/api/educator/update-role",
          {}, // empty body for PATCH request
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Option 2: Use the user route (alternative)
        // const { data } = await axios.patch(backendUrl + '/api/users/become-educator',
        //   {}, // empty body for PATCH request
        //   { headers: { Authorization: `Bearer ${token}` } })

        if (data.success) {
          setIsEducator(true);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error becoming educator:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-200 py-4 ${
        IsCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className=" bg-blue-700 text-white  px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>
      {/* for phone screen */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500 ">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="user" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
