import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdOutlineClear } from "react-icons/md";
import ProtectedRoutes from "../Utils/ProtectedRoutes";
import DisplayHospitalsOnMaps from "./Maps/DisplayHospitalsOnMaps";
const DoctorsSection = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [userType, setUserType] = useState("");

  const [hospitals, setHospitals] = useState([]);
  const [branches, setBranches] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDistance, setSelectedDistance] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchDistance = (targetLatitude, targetLongitude) => {
    // console.log("Target:", targetLatitude, targetLongitude);
    // console.log("Current:", currentLocation.lat, currentLocation.lng);
    if (currentLocation && targetLatitude && targetLongitude) {
      // Function to calculate distance using Haversine formula
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c; // Distance in km
        return distanceKm;
      };

      const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
      };

      const calculatedDistance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        targetLatitude,
        targetLongitude
      );
      // setDistance(calculatedDistance.toFixed(2));
      // const dis = calculateDistance;
      // console.log("calculated distance:", calculateDistance);
      return calculatedDistance.toFixed(2);
    } else {
      return null;
    }
  };

  const handleHospitalChange = (e) => {
    setSelectedHospital(e);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e);
  };

  const handleDistanceChange = (e) => {
    setSelectedDistance(e);
    console.log("Distance selected:", e);
  };

  useEffect(() => {
    let result = [...doctors];

    // Filter by Hospital
    if (selectedHospital) {
      result = result.filter((doctor) => doctor.hospital === selectedHospital);
    }

    if (selectedDistance) {
      result = result.filter((doctor) => {
        const dis = fetchDistance(doctor.lat, doctor.lng);
        // console.log("dis:",dis);
        return dis < parseFloat(selectedDistance);
      });
    }

    // Filter by Branch
    if (selectedBranch) {
      result = result.filter((doctor) => doctor.branch === selectedBranch);
    }

    // Filter by Name
    if (searchQuery) {
      result = result.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDoctors(result); // Update the filtered doctors state
  }, [
    selectedHospital,
    selectedDistance,
    selectedBranch,
    searchQuery,
    doctors,
  ]);

  // Button to clear all filters
  function ClearFilters() {
    window.location.reload();
  }

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

  // API for fetching hospital branches
  const fetchHospitalBranches = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/admin/GetAllBranches`,
        {
          withCredentials: true,
        }
      );
      setBranches(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
      // toast.error("Error fetching Branches");
    }
  };

  //  API for fetching doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/doctor/fetchAllDoctors`,
        {
          withCredentials: true,
        }
      );
      setDoctors(response.data);
      // console.log(response.data);
      if (response.data.length % 10 == 0) {
        setPagesCount(response.data.length / 10);
      } else {
        const set_page_count = Math.floor(response.data.length / 10);
        setPagesCount(set_page_count + 1);
      }
    } catch (error) {
      console.log(error);
      // toast.error("Error fetching doctors");
    }
  };

  // API for fetching hospitals
  const fetchHospitals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/admin/GetHospitals`,
        {
          withCredentials: true,
        }
      );
      setHospitals(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
      // toast.error("Error fetching doctors");
    }
  };

  const fetchJWT = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/auth/jwt`,
        {
          withCredentials: true,
        }
      );
      setIsUserLogin(true);
      setUserType(response.data.role);
    } catch (error) {
      // console.log("Error in fetching JWT!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchHospitalBranches();
    fetchHospitals();
    fetchJWT();
  }, []);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredDoctors.slice(firstPostIndex, lastPostIndex);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const previosPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
      {doctors.length > 0 && (
        <section className="min-h-screen border-">
          <div className="">
            <div className="flex flex-col items-center justify-center">
              <img src="./doctorsection.png" alt="" className="h-60  " />
              <span className=" text-2xl font-bold font-mono">
                Your health, our priority.
              </span>
            </div>

            <div className="w-full p-4 flex justify-center items-center">
              <DisplayHospitalsOnMaps />
            </div>

            {/* Filters */}
            <div className="p-4 flex flex-wrap justify-center items-center">
              {/* Hospitals */}
              <div className="p-2">
                <select
                  name="Hospitals"
                  className="btn bg-emerald-100 px-2"
                  onChange={(e) => handleHospitalChange(e.target.value)}
                >
                  <option value="#" className="bg-white text-black">
                    Select Hospital
                  </option>
                  {hospitals.map((hospital) => (
                    <option
                      key={hospital._id}
                      value={hospital.name}
                      className="bg-white text-black text-center"
                    >
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance */}
              <div className="p-2">
                <select
                  name="distance"
                  className="btn bg-warning px-2 text-white"
                  onChange={(e) => handleDistanceChange(e.target.value)}
                >
                  <option value="#" className="bg-white text-black">
                    Distance
                  </option>

                  <option value={2} className="bg-white text-black text-center">
                    Less than 2 km
                  </option>
                  <option value={5} className="bg-white text-black text-center">
                    Less than 5 km
                  </option>
                  <option
                    value={10}
                    className="bg-white text-black text-center"
                  >
                    Less than 10 km
                  </option>
                  <option
                    value={20}
                    className="bg-white text-black text-center"
                  >
                    Less than 20 km
                  </option>
                </select>
              </div>

              {/* Search Button */}
              <div className="min-w-40 p-2">
                <label className="input">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </g>
                  </svg>
                  <input
                    type="search"
                    className="grow"
                    placeholder="Search Doctor"
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </label>
              </div>

              {/* Branches */}
              <div className="p-2">
                <select
                  name="Hospitals"
                  className="btn bg-indigo-400 px-2 text-white"
                  onChange={(e) => handleBranchChange(e.target.value)}
                >
                  <option value="#" className="bg-white text-black">
                    Select Branch
                  </option>
                  {branches.map((branch) => (
                    <option
                      key={branch}
                      value={branch}
                      className="bg-white text-black text-center"
                    >
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div>
                <button
                  className="btn bg-red-400 text-white"
                  onClick={() => ClearFilters()}
                >
                  <MdOutlineClear />
                </button>
              </div>
            </div>

            {/* Doctors */}
            {currentPosts.length != 0 ? (
              <div className="flex flex-wrap justify-center gap-5">
                {currentPosts.map((doctor, index) => {
                  return (
                    <div
                      className="mt-20 relative w-60 h-60 rounded-2xl flex flex-col items-center bg-emerald-100"
                      key={doctor._id}
                    >
                      {doctor.gender === "male" ? (
                        <img
                          src="./male1.png"
                          alt="doctor image"
                          className="h-2/3 absolute bottom-40"
                        />
                      ) : (
                        <img
                          src="./female1.png"
                          alt="doctor image"
                          className="h-2/3 absolute bottom-40"
                        />
                      )}

                      <div className="mt-20">
                        <span className="text-emerald-600 font-semibold">
                          Dr. {doctor.name}
                        </span>
                      </div>
                      <div className="">
                        <span className="text-emerald-600">
                          <span className="font-semibold">Branch: </span>
                          {doctor.branch}
                        </span>
                      </div>
                      <div className="">
                        <span className="text-emerald-600">
                          <span className="font-semibold">Hospital: </span>
                          {doctor.hospital}
                        </span>
                      </div>
                      <div className="">
                        <span className="text-emerald-600">
                          <span className="font-semibold">Age: </span>
                          {calculateAge(doctor.dob)} ({doctor.gender})
                        </span>
                      </div>

                      {currentLocation && (
                        <div className="">
                          <span className="text-emerald-600">
                            <span className="font-semibold">Distance: </span>
                            {fetchDistance(doctor.lat, doctor.lng)} Km
                          </span>
                        </div>
                      )}
                      <div className="mt-2">
                        {isUserLogin && userType == "patient" ? (
                          <Link
                            className="btn bg-indigo-600 text-white hover:text-indigo-600 hover:bg-indigo-50 hover:border-1 hover:border-indigo-600"
                            to={`/book_appointment?doctorID=${doctor._id}&doctorName=${doctor.name}`}
                          >
                            Book Appointment
                          </Link>
                        ) : (
                          <Link className="btn bg-indigo-600 text-white hover:text-indigo-600 hover:bg-indigo-50 hover:border-1 hover:border-indigo-600 cursor-not-allowed">
                            Book Appointment
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div class="flex flex-col items-center justify-center py-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-12 h-12 text-gray-400 mb-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-700 mb-1">
                    No Results
                  </h3>
                  <p class="text-sm text-gray-500">
                    Sorry, we couldn't find any matching results.
                  </p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagesCount > 1 && (
              <div className="p-4 flex justify-center items-center mt-3">
                <div className="join">
                  {currentPage == 1 ? (
                    <button
                      disabled
                      className="join-item btn bg-emerald-100"
                    >{`<`}</button>
                  ) : (
                    <button
                      className="join-item btn bg-emerald-100"
                      onClick={() => previosPage()}
                    >{`<`}</button>
                  )}
                  <button className="join-item btn bg-white cursor-default">
                    Page {currentPage} of {pagesCount}
                  </button>
                  {currentPage == pagesCount ? (
                    <button
                      disabled
                      className="join-item btn bg-emerald-100 "
                    >{`>`}</button>
                  ) : (
                    <button
                      className="join-item btn bg-emerald-100 "
                      onClick={() => nextPage()}
                    >{`>`}</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default DoctorsSection;
