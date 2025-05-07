import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";

const AddAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [fields, setFields] = useState([]);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  const addField = () => {
    setFields([...fields, { id: Date.now(), value: "" }]);
  };

  const deleteField = (id) => {
    setFields(fields.filter((input) => input.id !== id));
  };

  const UpdateHospitalAchievements = async (data) => {
    const achievements = Object.values(data);
    const data1 = {
      achievements: achievements,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/hospital/updateAchievements`,
        data1,
        { withCredentials: true }
      );
      // console.log(response.data);
      toast.success("Achievements Updated!");
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
      // console.log(response.data[0].achievements);
      setAchievements(response.data[0].achievements);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHospitalDetails();
  }, []);

  useEffect(() => {
    if (achievements && achievements.length > 0) {
      const initialFields = achievements.map((achievement) => {
        let baseTime = Date.now();
        let random_num = Math.floor(Math.random() * 100);
        let newId = "achievement_" + baseTime + "" + random_num;
        return {
          id: newId,
          value: achievement,
        };
      });
      setFields(initialFields);

      initialFields.map((field) => {
        let id = field.id;
        let value = field.value;
        setValue(`achievement_${id}`, value);
      });
    }
  }, [achievements]);

  const handleInputChange = (id, value) => {};

  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="hover:text-emerald-500">
            <Link to="/hospital/admin/profile">Profile</Link>
          </li>
          <li className="text-emerald-500">Add Achievements</li>
        </ul>

        <div className="p-4">
          <h1>
            The Achievements will be shown in list format so you can add
            multiple achievements.
          </h1>
          <form
            onSubmit={handleSubmit((data) => UpdateHospitalAchievements(data))}
          >
            <fieldset className="fieldset border-1 border-gray-200 p-4">
              <legend className="fieldset-legend">Achievements</legend>
              {fields.map((input, index) => {
                return (
                  <div
                    className="flex justify-start items-center"
                    key={input.id}
                  >
                    <span className="h-7 w-7 flex justify-center items-center">
                      <FaLongArrowAltRight className="h-7 w-7 mr-1" />
                    </span>
                    <input
                      required
                      onChange={(e) =>
                        handleInputChange(input.id, e.target.value)
                      }
                      className="input w-full"
                      placeholder="Write about your achievement."
                      {...register(`achievement_${input.id}`)}
                    />
                    <MdDelete
                      className="h-6 w-6 text-red-500 cursor-pointer"
                      onClick={(e) => deleteField(input.id)}
                    />
                  </div>
                );
              })}
              <div className="ml-7">
                <Link
                  className="btn bg-indigo-600 text-white hover:text-indigo-600 hover:bg-white border-1 hover:border-indigo-600"
                  onClick={addField}
                >
                  Add Field
                </Link>
              </div>
            </fieldset>

            <button
              type="submit"
              className="mr-1 btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent border-2 hover:border-2 hover:border-emerald-600 my-4"
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
      </div>
    </div>
  );
};

export default AddAchievements;
