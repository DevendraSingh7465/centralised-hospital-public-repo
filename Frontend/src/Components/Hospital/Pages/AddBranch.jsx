import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCaretDown } from "react-icons/fa";

const AddBranch = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  const AddnewBranch = async (data) => {
    const details = {
      branch: data.branch.toUpperCase().trim(),
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/hospital/addBranch`,
        details,
        {
          withCredentials: true,
        }
      );
      //   console.log(response);
      toast.success("Branch added successfully!");
      reset();
      navigate("/hospital/admin/branches");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="hover:text-emerald-500">
            <Link to="/hospital/admin/branches">Branches</Link>
          </li>
          <li className="text-emerald-500">Add Branch</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Add Branch</h1>
        </div>
        <div className="rounded border-1 border-gray-300 p-3">
          <div className="">
            <h1 className="font-bold text-2xl m-1">Branch Details</h1>
          </div>
          <form onSubmit={handleSubmit((data) => AddnewBranch(data))}>
            <div className="rounded border-1 border-gray-300 p-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* Branch name */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Branch Name</legend>
                    <label className="input validator">
                      <input
                        type="input"
                        required
                        placeholder="Branch Name"
                        minLength="2"
                        maxLength="120"
                        {...register("branch", { required: true })}
                      />
                    </label>

                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>
              </div>
            </div>
            <div>
              <button className="btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent hover:border-2 hover:border-emerald-600 my-4">
                Add Branch
              </button>
              <Link
                to="/hospital/admin/branches"
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

export default AddBranch;
