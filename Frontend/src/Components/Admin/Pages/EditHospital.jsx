import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const EditHospital = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  const [hospitalId, setHospitalId] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalDetails, setHospitalDetails] = useState([]);

  useEffect(() => {
    // Get hospital ID and name from the URL query parameters
    const hospitalDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get("hospitalId");
      const name = searchParams.get("hospitalName");
      setHospitalId(id);
      setHospitalName(name);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/admin/GetSingleHospital/${id}`
      );
      setHospitalDetails(response.data);
    };

    hospitalDetails();
  }, []);

  const updateHospitalDetails = async (data) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/admin/UpdateHospitalDetails/${hospitalId}`,
        data
      );
      toast.success("Hospital Details Updated");
        reset();
        navigate("/admin/dashboard");
    } catch (error) {
      reset({
        name: "",
        email: "",
        mobile: "",
      });
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="hover:text-emerald-500">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="">Edit</li>
          <li className="text-emerald-500">{hospitalName}</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">{hospitalName}</h1>
        </div>
        <div className="rounded border-1 border-gray-300 p-3">
          <div className="">
            <h1 className="font-bold text-2xl m-1">Update Hospital Details</h1>
          </div>
          <form onSubmit={handleSubmit((data) => updateHospitalDetails(data))}>
            <div className="rounded border-1 border-gray-300 p-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* Hospital Nmae */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Hospital Name</legend>
                    <input
                      type="text"
                      className="input validator"
                      placeholder={hospitalDetails.name}
                      minLength={3}
                      maxLength={80}
                      {...register("name", { required: true })}
                    />
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
                      placeholder={hospitalDetails.email}
                      maxLength={30}
                      {...register("email", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Mobile Numebr */}

                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Contact</legend>
                    <input
                      type="tel"
                      className="input validator"
                      placeholder={hospitalDetails.mobile}
                      pattern="^[0-9]+$"
                      minLength={10}
                      maxLength={10}
                      title="Field must contain only numbers"
                      {...register("mobile", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Address */}
                <div className="col-span-1  sm:col-span-2 md:col-span-3 lg:col-span-3 ">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Address</legend>
                    <input
                      type="tel"
                      className="input validator w-full"
                      placeholder={hospitalDetails.address}
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
                      placeholder={hospitalDetails.pincode}
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
                      placeholder={hospitalDetails.city}
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
                      placeholder={hospitalDetails.state}
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
              <button
                // to="/admin/dashboard"
                type="submit"
                className="m-1 btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent hover:border-2 hover:border-emerald-600 my-4"
              >
                Save
              </button>
              <Link
                to="/admin/dashboard"
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

export default EditHospital;
