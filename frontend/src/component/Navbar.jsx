import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const {signOut}=UserAuth()
    const navigate=useNavigate()

 const Logout=async(e)=>{
    e.preventDefault();
    try {
        await signOut()
        navigate('/')
    } catch (error) {
        console.log(error);
        
    }
 }
  
  return (
    <nav className="bg-slate-800 text-white py-2">
      <div className="my-container flex justify-between items-center px-4 py-5 h-14">
        <div className="logo font-bold text-2xl">
          <span className="text-purple-600">&lt;</span>
          <span className="text-white">Pass</span>
          <span className="text-purple-600">MAN/&gt;</span>
        </div>
        <ul>
          <li className="flex gap-6 mr-3">
              <>
                <button
                  onClick={Logout}
                  className="hover:text-purple-400 p-2 font-semibold"
                  href="/">
                  LOGOUT
                </button>
              </>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
