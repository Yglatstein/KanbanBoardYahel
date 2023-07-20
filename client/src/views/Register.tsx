import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  async function handleSubmit(event: any) {
    event.preventDefault();
    try {
      const name = event.target.elements.nameRegister.value;
      const email = event.target.elements.emailRegister.value;
      const password = event.target.elements.passwordRegister.value;

      if (password.length < 10 || password.length > 30) {
        alert(
          "password length must be at least 10 characters and no more than 30."
        );
      } else if (password.includes(name)) {
        alert("password may not contain user's name");
      } else if (password.includes(email)) {
        alert("password may not contain user's email");
      }

      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });
      console.log(data);
      if (data.success == true) {
        navigate("/Login");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="login-signup-page">
      <div className="form">
        <form className="register-form" onSubmit={handleSubmit}>
          <input id="emailRegister" type="text" placeholder="email address" />
          <input id="nameRegister" type="text" placeholder="name" />
          <input id="passwordRegister" type="password" placeholder="password" />
          <button>create</button>
          <p className="message">
            Already Registered? <Link to="/">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
