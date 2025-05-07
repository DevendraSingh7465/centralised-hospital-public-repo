import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState([]);

  // Fetching User Details
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/user/fetchSingleUser`,
        {
          withCredentials: true,
        }
      );
      // console.log("User: ", response.data);
      setUserDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Function to convert date into string
  function convertDateFormat(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date format";
      }

      const day = date.getDate();
      const monthName = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${monthName} ${year}`;
    } catch (error) {
      return "Invalid date format";
    }
  }
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs text-sm">
          <ul className="">
            <li className="">User</li>
            <li className="text-emerald-500">Profile</li>
          </ul>
        </div>

        {/* User Details */}
        <div className="">
          <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend text-2xl text-emerald-600">
              User Details
            </legend>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Name:
              </span>
              <span className="text-lg font-mono">{userDetails.name}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Email:
              </span>
              <span className="text-lg font-mono">{userDetails.email}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Contact:
              </span>
              <span className="text-lg font-mono">{userDetails.mobile}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">DOB:</span>
              <span className="text-lg font-mono">
                {convertDateFormat(userDetails.dob)}
              </span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Gender:
              </span>
              <span className="text-lg font-mono">{userDetails.gender}</span>
            </div>
          </fieldset>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
