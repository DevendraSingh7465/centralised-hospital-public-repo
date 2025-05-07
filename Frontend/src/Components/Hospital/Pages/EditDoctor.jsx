import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const EditDoctor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  const [doctorDetails, setDoctorDetails] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchHospitalBranches = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/hospital/fetchHospitalBranches`,
          {
            withCredentials: true,
          }
        );
        setBranches(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching Branches");
      }
    };
    fetchHospitalBranches();
  }, []);

  useEffect(() => {
    const DoctorDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get("doctorId");
      const name = searchParams.get("doctorName");
      setDoctorId(id);
      setDoctorName(name);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/doctor/fetchSingleDoctor/${id}`
      );
      setDoctorDetails(response.data);
      //   console.log(response.data);
    };

    DoctorDetails();
  }, []);

  const updateDoctorDetails = async (data) => {
    // console.log(data);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/doctor/updateDoctor/${doctorId}`,
        data
      );
      toast.success("Doctor Details Updated");
      reset();
      navigate("/hospital/admin/doctors");
    } catch (error) {
      console.log(error);
      toast.error("Email or Contact already registered");
    }
  };

  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="hover:text-emerald-500">
            <Link to="/hospital/admin/dashboard">Dashboard</Link>
          </li>
          <li className="">Edit</li>
          <li className="text-emerald-500">{doctorName}</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">{doctorName}</h1>
        </div>
        <div className="rounded border-1 border-gray-300 p-3">
          <div className="">
            <h1 className="font-bold text-2xl m-1">Update Doctor Details</h1>
          </div>
          <form onSubmit={handleSubmit((data) => updateDoctorDetails(data))}>
            <div className="rounded border-1 border-gray-300 p-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* Doctor Name */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Doctor Name</legend>
                    <label className="input validator">
                      Dr.
                      <input
                        type="input"
                        required
                        placeholder={doctorDetails.name}
                        pattern="[A-Za-z\s]*"
                        minLength="3"
                        maxLength="100"
                        {...register("name", { required: true })}
                      />
                    </label>

                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Email */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email</legend>
                    <input
                      type="email"
                      className="input validator"
                      placeholder={doctorDetails.email}
                      maxLength={30}
                      {...register("email", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Mobile Number */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Contact</legend>
                    <input
                      type="tel"
                      className="input validator"
                      placeholder={doctorDetails.mobile}
                      pattern="^[0-9]+$"
                      minLength={10}
                      maxLength={10}
                      title="Field must contain only numbers"
                      {...register("mobile", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Gender */}
                <div className="flex">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Gender</legend>
                    <div className="flex items-center">
                      <div className="p-2">
                        <span className="mr-1">Male</span>
                        <input
                          type="radio"
                          name="gender"
                          className="radio radio-primary"
                          value="male"
                          {...register("gender", { required: true })}
                        />
                      </div>
                      <div className="p-2">
                        <span className="mr-1">Female</span>
                        <input
                          type="radio"
                          name="gender"
                          className="radio radio-secondary"
                          value="female"
                          {...register("gender", { required: true })}
                        />
                      </div>
                    </div>
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Date of Birth */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Date of Birth</legend>
                    <input
                      type="date"
                      className="input validator"
                      max={new Date().toISOString().split('T')[0]}
                      {...register("dob", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Branches */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Branch</legend>
                    <select
                      name="branches"
                      id="branches"
                      placeholder="Select Branch"
                      className="input"
                      required
                      {...register("branch", { required: true })}
                    >
                      <option value="">Select Branch </option>
                      {branches.map((branch, index) => (
                        <option key={branch._id} value={branch.branch}>
                          {branch.branch}
                        </option>
                      ))}
                    </select>

                    <p className="fieldset-label">
                      Required (
                      <Link
                        to="/hospital/admin/addBranch"
                        className=" link text-indigo-500"
                      >
                        "add branch"
                      </Link>
                      if not in the list)
                    </p>
                  </fieldset>
                </div>

                {/* Address */}
                <div className="col-span-1  sm:col-span-2 md:col-span-3 lg:col-span-3 ">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Address</legend>
                    <input
                      type="tel"
                      className="input validator w-full"
                      placeholder={doctorDetails.address}
                      minLength={3}
                      {...register("address", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Pin Code */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Pin Code</legend>
                    <input
                      type="tel"
                      className="input validator"
                      placeholder={doctorDetails.pincode}
                      pattern="^[0-9]+$"
                      minLength={5}
                      maxLength={10}
                      {...register("pincode", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* City */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">City</legend>
                    <input
                      type="tel"
                      className="input validator"
                      placeholder={doctorDetails.city}
                      minLength={3}
                      maxLength={30}
                      {...register("city", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* State */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">State</legend>
                    <input
                      type="tel"
                      className="input validator"
                      placeholder={doctorDetails.state}
                      pattern="^[a-zA-Z]+$"
                      minLength={3}
                      maxLength={30}
                      {...register("state", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>
              </div>
            </div>
            <div>
              <button className="btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent hover:border-2 hover:border-emerald-600 my-4">
                Update Details
              </button>
              <Link
                to="/hospital/admin/doctors"
                className="m-1 btn bg-red-500 text-white hover:text-red-500 hover:bg-transparent hover:border-2 hover:border-red-500 my-4"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditDoctor;
