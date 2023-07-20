import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import logo from "../../assets/images/logo.png";

import "./navbar.scss";

export const Navbar = () => {
  return (
    <header className="header">
      <div className="nav__wraper">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="navigation"></div>
        <div className="nav__right">
          <span>
            <a href="/login">
              <i>
                <AiOutlineUser />
              </i>
            </a>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
