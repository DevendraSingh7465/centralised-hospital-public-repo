import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HospitalProfile = () => {
  const [hospitalDetails, setHospitalDetails] = useState([]);

  const fetchHospitalDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/hospital/fetchHospitalDetails`,
        {
          withCredentials: true,
        }
      );
      setHospitalDetails(response.data[0]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHospitalDetails();
  }, []);

  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="text-emerald-500">Profile</li>
        </ul>
      </div>

      <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
        <legend className="fieldset-legend text-2xl text-emerald-600">
          {hospitalDetails.name} Details
        </legend>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">
            Hospital Name:
          </span>
          <span className="text-lg font-mono">{hospitalDetails.name}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Email:</span>
          <span className="text-lg font-mono">{hospitalDetails.email}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Contact:</span>
          <span className="text-lg font-mono">{hospitalDetails.mobile}</span>
        </div>

        <div className="flex justify-start items-center">
          <div className="flex h-full">
            <span className="text-lg font-mono mx-1 font-semibold">About:</span>
          </div>
          <span className="text-lg font-mono">
            {hospitalDetails.about ? (
              <>
                {hospitalDetails.about}
                <br />
                <Link
                  to="/hospital/admin/add_about"
                  className="badge badge-primary p-2 mx-2 hover:bg-white hover:border-1 hover:border-indigo-600 hover:text-indigo-600 "
                >
                  update
                </Link>
              </>
            ) : (
              <Link
                to="/hospital/admin/add_about"
                className="btn bg-indigo-600 text-white p-2 mx-2 hover:bg-white hover:border-1 hover:border-indigo-600 hover:text-indigo-600 "
              >
                Add about section
              </Link>
            )}
          </span>
        </div>

        <div className="flex justify-start items-center">
          <div className="flex h-full">
            <span className="text-lg font-mono mx-1 font-semibold">
              Achievements:
            </span>
          </div>
          <span className="text-lg font-mono">
            {hospitalDetails.achievements &&
            hospitalDetails.achievements.length > 0 ? (
              <>
                {hospitalDetails.achievements.map((achievement, index) => (
                  <div key={index}>• {achievement}</div>
                ))}
                <Link
                  to="/hospital/admin/add_achievements"
                  className="badge badge-primary p-2 mx-2 hover:bg-white hover:border-1 hover:border-indigo-600 hover:text-indigo-600 "
                >
                  Update achievements
                </Link>
              </>
            ) : (
              <Link
                to="/hospital/admin/add_achievements"
                className="btn bg-indigo-600 text-white p-2 mx-2 hover:bg-white hover:border-1 hover:border-indigo-600 hover:text-indigo-600 "
              >
                Add achievements
              </Link>
            )}
          </span>
        </div>

        <div className="flex justify-start items-center">
          <div className="flex h-full">
            <span className="text-lg font-mono mx-1 font-semibold">
              Address:
            </span>
          </div>
          <span className="text-lg font-mono">{hospitalDetails.address}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">City:</span>
          <span className="text-lg font-mono">{hospitalDetails.city}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">State:</span>
          <span className="text-lg font-mono">{hospitalDetails.state}</span>
        </div>

        <div className="flex justify-start items-center">
          <span className="text-lg font-mono mx-1 font-semibold">Pincode:</span>
          <span className="text-lg font-mono">{hospitalDetails.pincode}</span>
        </div>
      </fieldset>
    </div>
  );
};

export default HospitalProfile;
