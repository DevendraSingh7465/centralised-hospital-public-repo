import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const AddAboutSection = () => {
  const [about, setAbout] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  useEffect(() => {
    setValue("about", about);
  }, [about]);

  const updateHospitalAboutSection = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/hospital/updateAbout`,
        data,
        { withCredentials: true }
      );
      // console.log(response.data);
      toast.success("About Section Updated!");
      navigate("/hospital/admin/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHospitalDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/hospital/fetchHospitalDetails`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data[0].about);
      if (response.data[0].about) {
        setAbout(response.data[0].about);
      }
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
          <li className="hover:text-emerald-500">
            <Link to="/hospital/admin/profile">Profile</Link>
          </li>
          <li className="text-emerald-500">Add About Section</li>
        </ul>
      </div>

      <form
        className=" rounded-2xl p-2"
        onSubmit={handleSubmit((data) => updateHospitalAboutSection(data))}
      >
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Hospital About Section</legend>
          <textarea
            className="textarea h-24 w-full"
            placeholder="Write about your hospital."
            minLength={10}
            {...register("about", { required: true })}
          />
          <div className="label">Required</div>
        </fieldset>

        <button
          type="submit"
          className="m-1 btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent hover:border-2 hover:border-emerald-600 my-4"
        >
          Save
        </button>
        <Link
          to="/hospital/admin/profile"
          className="m-1 btn bg-red-500 text-white hover:text-red-500 hover:bg-transparent hover:border-2 hover:border-red-500 my-4"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
};

export default AddAboutSection;
