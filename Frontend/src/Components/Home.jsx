import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LandingPage from "./Sections/LandingPage";
import DoctorsSection from "./Sections/DoctorsSection";
import ContactForm from "./Sections/ContactForm";
import ChatBot from "./Sections/Chat/ChatBot";
const Home = () => {
  return (
    <div className="">
      <ChatBot/>
      <Navbar />
      <LandingPage />
      <DoctorsSection/>
      <ContactForm/>
      <Footer />
    </div>
  );
};

export default Home;
