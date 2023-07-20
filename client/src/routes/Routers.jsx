import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from "../views/Home";
import Login from '../views/Login';
import Register from '../views/Register';
import { Admin } from "../views/Admin";
import Page404 from "../views/page404";
import Logo from "../views/logo";

const Routers = () => {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Page404 />} />
            <Route path='/' element = {<Navigate to ='/home'/>}/>
            <Route path='/home' element = {<Home />}/>
            <Route path='/login' element = {<Login />}/>
            <Route path='/register' element = {<Register />}/>
            <Route path='/admin' element = {<Admin />}/>
            <Route path='/logo' element = {<Logo />}/>
          </Routes>
        </BrowserRouter>
      );
  };
  
  export default Routers;