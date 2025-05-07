import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoDotFill } from "react-icons/go";

const DoctorAndHospitalDetails = ({ doctorID }) => {
  const [doctorId, setDoctorId] = useState([]);
  useEffect(() => {
    setDoctorId(doctorID);
  }, []);

  const [doctorDetails, setDoctorDetails] = useState([]);
  const [doctorAchievements, setDoctorAchievements] = useState([]);
  const [hospitalAchievements, setHospitalAchievements] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [experience, setExperience] = useState([]);
  const [hospitalDetails, setHospitalDetails] = useState([]);

  // Fetching Doctor and Hospital Details
  const fetchHospitalAndDoctorDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/user/FetchHospitalAndDoctorDetails/${doctorID}`,
        {
          withCredentials: true,
        }
      );
      //   console.log("Doctor and Hospital Details: ", response.data);

      //   console.log("Doctor Details: ", response.data.doctorDetails[0]);
      setDoctorDetails(response.data.doctorDetails[0]);
      setDoctorAchievements(response.data.doctorDetails[0].achievements);
      setEducationDetails(response.data.doctorDetails[0].education);
      setExperience(response.data.doctorDetails[0].experience);

      //   console.log("Hospital Details: ", response.data.hospitalDetails[0]);
      setHospitalDetails(response.data.hospitalDetails[0]);
      setHospitalAchievements(response.data.hospitalDetails[0].achievements);
    } catch (error) {
      //   console.log(error);
    }
  };

  useEffect(() => {
    fetchHospitalAndDoctorDetails();
  }, [doctorId]);

  // Function for calculate age from date of birth (dob)
  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  return (
    <div className="flex flex-wrap justify-start items-start w-full gap-2">
      {/* Doctor Details */}
      <div className="  w-5/12">
        <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend text-emerald-600">
            Doctor Details
          </legend>

          <div className="flex justify-start items-center">
            <span className="text-base font-mono mx-1 font-semibold">
              Name:
            </span>
            <span className="text-base font-mono">Dr.{doctorDetails.name}</span>
          </div>

          <div className="flex justify-start items-center">
            <span className="text-base font-mono mx-1 font-semibold">Age:</span>
            <span className="text-base font-mono">
              {calculateAge(doctorDetails.dob)}
            </span>
          </div>

          <div className="flex justify-start items-center">
            <span className="text-base font-mono mx-1 font-semibold">
              Branch:
            </span>
            <span className="text-base font-mono">{doctorDetails.branch}</span>
          </div>

          <div className="flex justify-start items-center">
            <span className="text-base font-mono mx-1 font-semibold">
              Gender:
            </span>
            <span className="text-base font-mono">{doctorDetails.gender}</span>
          </div>

          {educationDetails.length > 0 && (
            <div>
              <span className="text-base font-mono mx-1 font-semibold">
                Education:
              </span>
              <div className="grid pl-4 pt-1">
                {educationDetails.map((education, index) => {
                  return (
                    <div className="flex items-center" key={index}>
                      <span>
                        <GoDotFill className="text-gray-500" />
                      </span>
                      <span className="text-base font-mono text-gray-600">
                        {education}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {doctorAchievements.length > 0 && (
            <div>
              <span className="text-base font-mono mx-1 font-semibold">
                Achievements:
              </span>
              <div className="grid pl-4 pt-1">
                {doctorAchievements.map((achievement, index) => {
                  return (
                    <div className="flex items-center" key={index}>
                      <span>
                        <GoDotFill className="text-gray-500" />
                      </span>
                      <span className="text-base font-mono text-gray-600">
                        {achievement}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <span className="text-base font-mono mx-1 font-semibold">
                Experience:
              </span>
              <div className="grid pl-4 pt-1">
                {experience.map((experience, index) => {
                  return (
                    <div className="flex items-center" key={index}>
                      <span>
                        <GoDotFill className="text-gray-500" />
                      </span>
                      <span className="text-base font-mono text-gray-600">
                        {experience}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </fieldset>
      </div>

      {/* Hospital Details */}
      <div className="  w-5/12">
        <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend text-emerald-600">
            Hospital Details
          </legend>

          <div className="flex justify-start items-center">
            <span className="text-base font-mono mx-1 font-semibold">
              Hospital Name:
            </span>
            <span className="text-base font-mono">{hospitalDetails.name}</span>
          </div>

          {hospitalAchievements.length > 0 && (
            <div>
              <span className="text-base font-mono mx-1 font-semibold">
                Hospital Achievements:
              </span>
              <div className="grid pl-4 pt-1">
                {hospitalAchievements.map((achievement, index) => {
                  return (
                    <div className="flex items-center" key={index}>
                      <span>
                        <GoDotFill className="text-gray-500" />
                      </span>
                      <span className="text-base font-mono text-gray-600">
                        {achievement}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {hospitalDetails.about && (
            <div className="flex justify-start items-center">
              <span className="text-base font-mono mx-1 font-semibold">
                About:
              </span>
              <span className="text-base font-mono">
                {hospitalDetails.about}
              </span>
            </div>
          )}

          <div className="flex justify-start items-center">
            <span className="text-base font-mono mx-1 font-semibold">
              Address:
            </span>
            <span className="text-base font-mono">
              {hospitalDetails.address}, {hospitalDetails.city},{" "}
              {hospitalDetails.state}
            </span>
          </div>
          <div className="flex justify-start items-center">
            <span className="text-base font-mono mx-1 font-semibold">
              Pincode:
            </span>
            <span className="text-base font-mono">
              {hospitalDetails.pincode}
            </span>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default DoctorAndHospitalDetails;
