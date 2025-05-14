import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./Components/Home";
import Login from "./Components/Register/Login";
import ProtectedRoutes from "./Components/Utils/ProtectedRoutes";
import Signup from "./Components/Register/Signup";
import PageNotFound from "./Components/PageNotFound";
import Adminlayout from "./Components/Admin/Adminlayout";
import Dashboard from "./Components/Admin/Pages/Dashboard";
import Doctors from "./Components/Admin/Pages/Doctors";
import AddHospital from "./Components/Admin/Pages/AddHospital";
import AllAppointments from "./Components/Admin/Pages/AllAppointments";
import IndexPage from "./Components/Admin/Pages/IndexPage";
import EditHospital from "./Components/Admin/Pages/EditHospital";
import HospitalAdminlayout from "./Components/Hospital/HospitalAdminlayout";
import HospitalIndexPage from "./Components/Hospital/Pages/HospitalIndexPage";
import HospitalDashboard from "./Components/Hospital/Pages/HospitalDashboard";
import HospitalDoctors from "./Components/Hospital/Pages/HospitalDoctors";
import AddDoctor from "./Components/Hospital/Pages/AddDoctor";
import Branches from "./Components/Hospital/Pages/Branches";
import AddBranch from "./Components/Hospital/Pages/AddBranch";
import EditDoctor from "./Components/Hospital/Pages/EditDoctor";
import Appointments from "./Components/Sections/Appointments";
import BookAppointmentLayout from "./Components/Sections/Appointment/BookAppointmentLayout";
import BookAppointmentForSelf from "./Components/Sections/Appointment/BookAppointmentForSelf";
import BookAppointmentForOther from "./Components/Sections/Appointment/BookAppointmentForOther";
import DoctorAppointmentsLayout from "./Components/Doctor/DoctorAppointmentsLayout";
import TodaysAppointments from "./Components/Doctor/TodaysAppointments";
import PendingAppointments from "./Components/Doctor/PendingAppointments";
import DoctorAppointments from "./Components/Doctor/DoctorAppointments";
import ContactMessages from "./Components/Admin/Pages/ContactMessages";
import HospitalProfile from "./Components/Hospital/Pages/HospitalProfile";
import AddAboutSection from "./Components/Hospital/Pages/AddAboutSection";
import AddAchievements from "./Components/Hospital/Pages/AddAchievements";
import DoctorProfile from "./Components/Doctor/DoctorProfile";
import UserProfile from "./Components/Sections/UserProfile";
import ShowDoctorProfile from "./Components/Hospital/Pages/ShowDoctorProfile";
import HospitalDetails from "./Components/Admin/Pages/HospitalDetails";
function App() {
  // console.log(`VITE_API_BACKEND: ${import.meta.env.VITE_API_BACKEND}`);
  return (
    <div>
      {/* <ProtectedRoutes element={<HospitalAdminlayout />} allowedRoles={["hospital"]} /> */}

      <Routes>
        {/* Home Page Routes */}
        <Route element={<Home />} path="/" />

        {/* View Appointment Page for patients */}
        <Route
          element={
            <ProtectedRoutes
              element={<Appointments />}
              allowedRoles={["patient"]}
            />
          }
          path="/view_appointment"
        />

        {/* User profile for pateints */}
        <Route
          element={
            <ProtectedRoutes
              element={<UserProfile />}
              allowedRoles={["patient"]}
            />
          }
          path="/user_profile"
        />

        {/* Doctor Routes */}
        <Route
          element={
            <ProtectedRoutes
              element={<DoctorAppointmentsLayout />}
              allowedRoles={["doctor"]}
            />
          }
          path="/view_my_appointments"
        >
          <Route path="todays_appointments" element={<TodaysAppointments />} />
          <Route path="pending_requests" element={<PendingAppointments />} />
          <Route path="all" element={<DoctorAppointments />} />
        </Route>

        {/* Doctor Profile Routes */}
        <Route
          element={
            <ProtectedRoutes
              element={<DoctorProfile />}
              allowedRoles={["doctor"]}
            />
          }
          path="/doctor_profile"
        />

        {/* Book appointment routes for patients */}
        <Route
          element={
            <ProtectedRoutes
              element={<BookAppointmentLayout />}
              allowedRoles={["patient"]}
            />
          }
          path="/book_appointment"
        >
          <Route index path="Self" element={<BookAppointmentForSelf />} />
          <Route path="Other" element={<BookAppointmentForOther />} />
        </Route>

        {/* Register Routes Login and Signup */}
        <Route element={<Login />} path="/login" />
        <Route element={<Signup />} path="/signup" />

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoutes
              element={<Adminlayout />}
              allowedRoles={["admin"]}
            />
          }
          path="/admin/"
        >
          <Route index element={<IndexPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="addhospital" element={<AddHospital />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="contact_messages" element={<ContactMessages />} />
          <Route path="all_appointments" element={<AllAppointments />} />
          <Route path="editHospital" element={<EditHospital />} />
          <Route path="hospitalDetails" element={<HospitalDetails />} />
        </Route>

        {/* All Hospital Admin Routes */}
        <Route
          element={
            <ProtectedRoutes
              element={<HospitalAdminlayout />}
              allowedRoles={["hospital"]}
            />
          }
          path="/hospital/admin"
        >
          <Route index element={<HospitalIndexPage />} />
          <Route path="profile" element={<HospitalProfile />} />
          <Route path="add_about" element={<AddAboutSection />} />
          <Route path="add_achievements" element={<AddAchievements />} />
          <Route path="dashboard" element={<HospitalDashboard />} />
          <Route path="doctors" element={<HospitalDoctors />} />
          <Route path="doctor_profile" element={<ShowDoctorProfile />} />
          <Route path="adddoctor" element={<AddDoctor />} />
          <Route path="branches" element={<Branches />} />
          <Route path="addBranch" element={<AddBranch />} />
          <Route path="editDoctor" element={<EditDoctor />} />
        </Route>

        {/* 404 Page not found routes */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
