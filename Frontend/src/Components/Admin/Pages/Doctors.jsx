import React, { useEffect, useState } from "react";
import axios from "axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  const handleHospitalChange = (e) => {
    setSelectedHospital(e);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e);
  };

  useEffect(() => {
    let result = [...doctors];

    // Filter by Hospital
    if (selectedHospital) {
      result = result.filter((doctor) => doctor.hospital === selectedHospital);
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
  }, [selectedHospital, selectedBranch, searchQuery, doctors]);

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
    }
  };
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/admin/getDoctorsWithHospitals`,
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
    }
  };
  const fetchBranches = async () => {
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
    }
  };

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
    fetchBranches();
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
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="text-emerald-500">Doctors</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Doctors</h1>
        </div>

        <div className="p-2 flex">
          {/* Search */}
          <div className="flex justify-center items-center">
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
          <div className="px-2">
            <select
              name="Select Branch"
              className="btn btn-outline btn-primary appearance-none"
              onChange={(e) => handleBranchChange(e.target.value)}
            >
              <option value="" className="bg-white text-black">
                Select Branch
              </option>
              {branches.map((branch) => (
                <option
                  key={branch._id}
                  value={branch.branch}
                  className="bg-white text-black text-center"
                >
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Hospitals */}
          <div>
            <select
              name="Select Branch"
              className="btn btn-outline btn-accent appearance-none"
              onChange={(e) => handleHospitalChange(e.target.value)}
            >
              <option value="" className="bg-white text-black">
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box text-black ">
          <table className="table text-black border-b-2 border-green-200">
            {/* head */}
            <thead>
              <tr className="text-black bg-green-50">
                <th></th>
                <th>Name</th>
                <th>Hospital</th>
                <th>Branch</th>
                <th>Email</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {currentPosts.map((doctors, index) => (
                <tr key={doctors._id}>
                  <th>{index + 1}</th>
                  <td>{doctors.name}</td>
                  <td>{doctors.hospital}</td>
                  <td>{doctors.branch}</td>
                  <td>{doctors.email}</td>
                  <td>{doctors.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagesCount > 1 && (
            <div className="p-4">
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
    </div>
  );
};

export default Doctors;
