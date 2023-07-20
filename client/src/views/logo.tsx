import React from "react";
import logo from "../assets/images/logo.png";
import "./logo.scss";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <div>
      <img src={logo} alt="" />
      <p>
        Go back <Link to="/">Home</Link>
      </p>
    </div>
  );
};

export default Logo;
