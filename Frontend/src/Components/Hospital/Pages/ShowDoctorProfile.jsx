import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GoDotFill } from "react-icons/go";

const ShowDoctorProfile = () => {
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [experience, setExperience] = useState([]);
  const [doctorName, setDoctorName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const DoctorDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get("doctorId");
      const name = searchParams.get("doctorName");
      setDoctorName(name);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/doctor/fetchSingleDoctor/${id}`
      );
      setDoctorDetails(response.data);
      setAchievements(response.data.achievements);
      setEducationDetails(response.data.education);
      setExperience(response.data.experience);
      const education_details = response.data.education;
      console.log(education_details);
    };

    DoctorDetails();
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
    <div className="p-4">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="hover:text-emerald-500">
            <Link to="/hospital/admin/doctors">Doctors</Link>
          </li>
          <li className="">Dr.{doctorName}</li>
          <li className="text-emerald-500">Profile</li>
        </ul>
      </div>

      <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
        <legend className="fieldset-legend text-2xl text-emerald-600">
          Doctor Details
        </legend>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Name:</span>
          <span className="text-lg font-mono">Dr.{doctorDetails.name}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Email:</span>
          <span className="text-lg font-mono">{doctorDetails.email}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Contact:</span>
          <span className="text-lg font-mono">{doctorDetails.mobile}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Branch:</span>
          <span className="text-lg font-mono">{doctorDetails.branch}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">DOB:</span>
          <span className="text-lg font-mono">
            {convertDateFormat(doctorDetails.dob)}
          </span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Gender:</span>
          <span className="text-lg font-mono">{doctorDetails.gender}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Address:</span>
          <span className="text-lg font-mono">{doctorDetails.address}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">City:</span>
          <span className="text-lg font-mono">{doctorDetails.city}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">State:</span>
          <span className="text-lg font-mono">{doctorDetails.state}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Pincode:</span>
          <span className="text-lg font-mono">{doctorDetails.pincode}</span>
        </div>
      </fieldset>

      {/* Education */}
      {educationDetails.length != 0 && (
        <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend text-2xl text-emerald-600">
            Education
          </legend>

          {educationDetails.map((education, index) => {
            return (
              <div className="flex justify-start items-center" key={index}>
                <span className="h-7 w-7 flex justify-center items-center">
                  <GoDotFill className="h-4 w-4 mr-1" />
                </span>
                <span className="text-lg font-mono">{education}</span>
              </div>
            );
          })}
        </fieldset>
      )}

      {/* Achievements */}
      {achievements.length != 0 && (
        <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend text-2xl text-emerald-600">
            Achievements
          </legend>

          {achievements.map((achievement, index) => {
            return (
              <div className="flex justify-start items-center" key={index}>
                <span className="h-7 w-7 flex justify-center items-center">
                  <GoDotFill className="h-4 w-4 mr-1" />
                </span>
                <span className="text-lg font-mono">{achievement}</span>
              </div>
            );
          })}
        </fieldset>
      )}

      {/* Experience */}
      {experience.length != 0 && (
        <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend text-2xl text-emerald-600">
            Experience
          </legend>

          {experience.map((experience, index) => {
            return (
              <div className="flex justify-start items-center" key={index}>
                <span className="h-7 w-7 flex justify-center items-center">
                  <GoDotFill className="h-4 w-4 mr-1" />
                </span>
                <span className="text-lg font-mono">{experience}</span>
              </div>
            );
          })}
        </fieldset>
      )}
    </div>
  );
};

export default ShowDoctorProfile;
