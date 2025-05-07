import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import Navbar from "../Navbar";
import Footer from "../Footer";

const DoctorProfile = () => {
  // States
  const [achievements, setAchievements] = useState([]);
  const [achievementFields, setAchievementFields] = useState([]);

  const [educationDetails, setEducationDetails] = useState([]);
  const [educationDetailsFields, setEducationDetailsFields] = useState([]);

  const [experience, setExperience] = useState([]);
  const [experienceFields, setExperienceFields] = useState([]);

  const [doctorDetails, setDoctorDetails] = useState([]);
  const [hospitalDetails, setHospitalDetails] = useState([]);

  // Fetching Doctor and Hospital Details
  const fetchHospitalAndDoctorDetails = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BACKEND
        }/doctor/fetchHospitalAndDoctorDetails`,
        {
          withCredentials: true,
        }
      );
      // console.log("Doctor: ", response.data.doctorDetails[0]);
      setDoctorDetails(response.data.doctorDetails[0]);
      setAchievements(response.data.doctorDetails[0].achievements);
      setEducationDetails(response.data.doctorDetails[0].education);
      setExperience(response.data.doctorDetails[0].experience);

      //   console.log("Hospital: ", response.data.hospitalDetails[0]);
      setHospitalDetails(response.data.hospitalDetails[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHospitalAndDoctorDetails();
  }, []);

  // React Hook Form, 3 instances becuase we are using 3 forms
  const form1 = useForm({ shouldUnregister: true });
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
  } = form1;
  const form2 = useForm({ shouldUnregister: true });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
  } = form2;
  const form3 = useForm({ shouldUnregister: true });
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    setValue: setValue3,
  } = form3;

  // Function to convert date into string
  function convertDateFormat(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date format";
      }

      const day = date.getDate();
      const monthName = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${monthName} ${year}`;
    } catch (error) {
      return "Invalid date format";
    }
  }

  // Achievements ************************************
  const addAchievementField = () => {
    setAchievementFields([...achievementFields, { id: Date.now(), value: "" }]);
  };
  const deleteAchievementField = (id) => {
    setAchievementFields(achievementFields.filter((input) => input.id !== id));
  };
  const UpdateDoctorAchievements = async (data) => {
    console.log("Achievements Data: ", data);
    const achievements = Object.values(data);
    const data1 = {
      achievements: achievements,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/doctor/updateAchievements`,
        data1,
        { withCredentials: true }
      );
      // console.log(response.data);
      toast.success("Achievements Updated!");
    } catch (error) {
      console.log(error);
    }
  };

  // Education ***************************************
  const addEducationField = () => {
    setEducationDetailsFields([
      ...educationDetailsFields,
      { id: Date.now(), value: "" },
    ]);
  };
  const deleteEducationField = (id) => {
    setEducationDetailsFields(
      educationDetailsFields.filter((input) => input.id !== id)
    );
  };
  const UpdateDoctorEducation = async (data) => {
    console.log("Education Data: ", data);
    const education = Object.values(data);
    const data1 = {
      education: education,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/doctor/updateEducation`,
        data1,
        { withCredentials: true }
      );
      // console.log(response.data);
      toast.success("Education Details Updated!");
    } catch (error) {
      console.log(error);
    }
  };

  // Experience **************************************
  const addExperienceField = () => {
    setExperienceFields([...experienceFields, { id: Date.now(), value: "" }]);
  };
  const deleteExperienceField = (id) => {
    setExperienceFields(experienceFields.filter((input) => input.id !== id));
  };
  const UpdateDoctorExperience = async (data) => {
    console.log("Experience Data: ", data);
    const experience = Object.values(data);
    const data1 = {
      experience: experience,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/doctor/updateExperience`,
        data1,
        { withCredentials: true }
      );
      // console.log(response.data);
      toast.success("Experiences Updated!");
    } catch (error) {
      console.log(error);
    }
  };

  // Set Experiences
  useEffect(() => {
    if (educationDetails && educationDetails.length > 0) {
      const initialEducationFields = educationDetails.map((education) => {
        let baseTime = Date.now();
        let random_num = Math.floor(Math.random() * 100);
        let newId = "experience_" + baseTime + "" + random_num;
        return {
          id: newId,
          value: education,
        };
      });
      setEducationDetailsFields(initialEducationFields);

      initialEducationFields.map((field) => {
        let id = field.id;
        let value = field.value;
        setValue1(`education_${id}`, value);
      });
    }
  }, [educationDetails]);

  // Set Experiences
  useEffect(() => {
    if (experience && experience.length > 0) {
      const initialExperienceFields = experience.map((experience) => {
        let baseTime = Date.now();
        let random_num = Math.floor(Math.random() * 100);
        let newId = "experience_" + baseTime + "" + random_num;
        return {
          id: newId,
          value: experience,
        };
      });
      setExperienceFields(initialExperienceFields);

      initialExperienceFields.map((field) => {
        let id = field.id;
        let value = field.value;
        setValue2(`experience_${id}`, value);
      });
    }
  }, [experience]);

  // Set Achievements
  useEffect(() => {
    if (achievements && achievements.length > 0) {
      const initialAchievementsFields = achievements.map((achievement) => {
        let baseTime = Date.now();
        let random_num = Math.floor(Math.random() * 100);
        let newId = "achievement_" + baseTime + "" + random_num;
        return {
          id: newId,
          value: achievement,
        };
      });
      setAchievementFields(initialAchievementsFields);

      initialAchievementsFields.map((field) => {
        let id = field.id;
        let value = field.value;
        setValue3(`achievement_${id}`, value);
      });
    }
  }, [achievements]);
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs text-sm">
          <ul className="">
            <li className="">Doctor</li>
            <li className="text-emerald-500">Profile</li>
          </ul>
        </div>

        {/* Doctor Details */}
        <div className="">
          <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend text-2xl text-emerald-600">
              Doctor Details
            </legend>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Name:
              </span>
              <span className="text-lg font-mono">Dr.{doctorDetails.name}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Hospital:
              </span>
              <span className="text-lg font-mono">{hospitalDetails.name}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Branch:
              </span>
              <span className="text-lg font-mono">{doctorDetails.branch}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Email:
              </span>
              <span className="text-lg font-mono">{doctorDetails.email}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Contact:
              </span>
              <span className="text-lg font-mono">{doctorDetails.mobile}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">DOB:</span>
              <span className="text-lg font-mono">
                {convertDateFormat(doctorDetails.dob)}
              </span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Gender:
              </span>
              <span className="text-lg font-mono">{doctorDetails.gender}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Address:
              </span>
              <span className="text-lg font-mono">{doctorDetails.address}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                City:
              </span>
              <span className="text-lg font-mono">{doctorDetails.city}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                State:
              </span>
              <span className="text-lg font-mono">{doctorDetails.state}</span>
            </div>

            <div className="flex justify-start items-center">
              <span className="text-lg font-mono mx-1 font-semibold">
                Pincode:
              </span>
              <span className="text-lg font-mono">{doctorDetails.pincode}</span>
            </div>
          </fieldset>

          {/* Doctor Education */}
          <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend text-2xl text-emerald-600">
              Education Details
            </legend>
            <div className="">
              <form
                onSubmit={form1.handleSubmit((data) =>
                  UpdateDoctorEducation(data)
                )}
              >
                <fieldset className="fieldset border-1 border-gray-200 p-4 rounded-box">
                  {educationDetailsFields.map((input, index) => {
                    return (
                      <div
                        className="flex justify-start items-center my-1"
                        key={input.id}
                      >
                        <span className="h-7 w-7 flex justify-center items-center">
                          <GoDotFill className="h-4 w-4 mr-1" />
                        </span>
                        <input
                          required
                          className="input w-full"
                          placeholder="Write about your education."
                          {...register1(`education_${input.id}`)}
                        />
                        <MdDelete
                          className="h-6 w-6 text-red-500 cursor-pointer"
                          onClick={(e) => deleteEducationField(input.id)}
                        />
                      </div>
                    );
                  })}
                  <div className="ml-7">
                    <Link
                      className="btn bg-indigo-600 text-white hover:text-indigo-600 hover:bg-white border-1 hover:border-indigo-600"
                      onClick={addEducationField}
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
                <a
                  href="/doctor_profile"
                  className="m-1 btn bg-red-500 text-white hover:text-red-500 hover:bg-transparent hover:border-2 hover:border-red-500 my-4"
                >
                  Cancel
                </a>
              </form>
            </div>
          </fieldset>

          {/* Doctor Experience */}
          <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend text-2xl text-emerald-600">
              Experience
            </legend>
            <div className="">
              <form
                onSubmit={form2.handleSubmit((data) =>
                  UpdateDoctorExperience(data)
                )}
              >
                <fieldset className="fieldset border-1 border-gray-200 p-4 rounded-box">
                  {experienceFields.map((input, index) => {
                    return (
                      <div
                        className="flex justify-start items-center"
                        key={input.id}
                      >
                        <span className="h-7 w-7 flex justify-center items-center">
                          <GoDotFill className="h-4 w-4 mr-1" />
                        </span>
                        <input
                          required
                          className="input w-full"
                          placeholder="Write about your experiences."
                          {...register2(`experience_${input.id}`)}
                        />
                        <MdDelete
                          className="h-6 w-6 text-red-500 cursor-pointer"
                          onClick={(e) => deleteExperienceField(input.id)}
                        />
                      </div>
                    );
                  })}
                  <div className="ml-7">
                    <Link
                      className="btn bg-indigo-600 text-white hover:text-indigo-600 hover:bg-white border-1 hover:border-indigo-600"
                      onClick={addExperienceField}
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
                <a
                  href="/doctor_profile"
                  className="m-1 btn bg-red-500 text-white hover:text-red-500 hover:bg-transparent hover:border-2 hover:border-red-500 my-4"
                >
                  Cancel
                </a>
              </form>
            </div>
          </fieldset>

          {/* Doctor Achievements */}
          <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend text-2xl text-emerald-600">
              Achievements
            </legend>
            <div className="">
              <form
                onSubmit={form3.handleSubmit((data) =>
                  UpdateDoctorAchievements(data)
                )}
              >
                <fieldset className="fieldset border-1 border-gray-200 p-4 rounded-box">
                  {achievementFields.map((input, index) => {
                    return (
                      <div
                        className="flex justify-start items-center"
                        key={input.id}
                      >
                        <span className="h-7 w-7 flex justify-center items-center">
                          <GoDotFill className="h-4 w-4 mr-1" />
                        </span>
                        <input
                          required
                          className="input w-full"
                          placeholder="Write about your achievement."
                          {...register3(`achievement_${input.id}`)}
                        />
                        <MdDelete
                          className="h-6 w-6 text-red-500 cursor-pointer"
                          onClick={(e) => deleteAchievementField(input.id)}
                        />
                      </div>
                    );
                  })}
                  <div className="ml-7">
                    <Link
                      className="btn bg-indigo-600 text-white hover:text-indigo-600 hover:bg-white border-1 hover:border-indigo-600"
                      onClick={addAchievementField}
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
                <a
                  href="/doctor_profile"
                  className="m-1 btn bg-red-500 text-white hover:text-red-500 hover:bg-transparent hover:border-2 hover:border-red-500 my-4"
                >
                  Cancel
                </a>
              </form>
            </div>
          </fieldset>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorProfile;
