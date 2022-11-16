import React from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDropdownCircle } from "react-icons/io";

import "../App.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>Get Supermind</h1>
      <div className="profile">
        <CgProfile className="icon" size={30} />
        <IoIosArrowDropdownCircle
          className="icon"
          size={15}
          color="slategrey"
        />
      </div>
    </div>
  );
};

export default Navbar;
