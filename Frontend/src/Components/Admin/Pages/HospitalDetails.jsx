import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GoDotFill } from "react-icons/go";
const HospitalDetails = () => {
  const [hospitalDetails, setHospitalDetails] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const location = useLocation();

  useEffect(() => {
    const DoctorDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get("hospitalId");
      const name = searchParams.get("hospitalName");
      setHospitalName(name);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/admin/GetSingleHospital/${id}`
      );

      console.log(response.data);
      setHospitalDetails(response.data);
    };

    DoctorDetails();
  }, []);

  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="">{hospitalName}</li>
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

        {hospitalDetails.about && (
          <div className="flex justify-start items-center">
            <div className="flex h-full">
              <span className="text-lg font-mono mx-1 font-semibold">
                About:
              </span>
            </div>
            <span className="text-lg font-mono">{hospitalDetails.about}</span>
          </div>
        )}

        {hospitalDetails.achievements &&
          hospitalDetails.achievements.length > 0 && (
            <div className="flex justify-start items-center">
              <div className="flex h-full">
                <span className="text-lg font-mono mx-1 font-semibold">
                  Achievements:
                </span>
              </div>
              <span className="text-lg font-mono">
                <span>
                  {hospitalDetails.achievements.map((achievement, index) => (
                    <div key={index}>• {achievement}</div>
                  ))}
                </span>
              </span>
            </div>
          )}

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

export default HospitalDetails;
