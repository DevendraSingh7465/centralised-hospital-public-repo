import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal footer-center bg-emerald-500 text-base-content p-4 ">
        <aside>
          <p className="text-white">
            Copyright © {new Date().getFullYear()} - All right reserved 
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
