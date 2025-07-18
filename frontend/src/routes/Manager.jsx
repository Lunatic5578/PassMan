import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";


const Manager = () => {

  const {session}=UserAuth()
  useEffect(() => {
    //console.log("User session updated:", session);
  }, [session]);

  const userId=session.user.id;

  const ref = useRef();
  const passRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const backendurl=import.meta.env.VITE_BACKEND_URL || " http://127.0.0.1:3000"; 
  // Fetch passwords based on the userId
  const getPass = async () => { 
    let req = await fetch(`${backendurl}/api/passwords?userId=${userId}`);
    let passwords = await req.json();
    setPasswordArray(passwords);
  };

  // Ensure to refetch passwords when userId changes
  useEffect(() => {
    if (session?.user?.id) {
      //console.log("User ID from session:", session.user.id);
      getPass();
    }
  }, [session]);

  const savePass = async () => {
    if (form.site.length > 8 && form.username.length > 2 && form.password.length > 2) {
      const passwordToSave = { ...form, id: uuidv4(), userId };  // Include userId here
      setPasswordArray([...passwordArray, passwordToSave]);

      // Save password to backend
      await fetch(`${backendurl}/api/passwords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordToSave),
      });

      //console.log("pass array from frontend:",[...passwordArray, passwordToSave]);
      setform({ site: "", username: "", password: "" });
      toast("✅ Password saved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast("❎Error: Invalid inputs!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const delPass = async (id) => {
    //console.log("deleting pass with id:" + id);
    let c = confirm("Do you really want to delete this?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      
      // Delete password from backend
      await fetch(`${backendurl}/api/passwords`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, userId }),  // Include userId to prevent unauthorized deletion
      });

      toast("✅ Password deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editPass = async(id) => {
    //console.log("editing pass with id:"+id);
    setform(passwordArray.filter(i=>i.id===id)[0])
    setPasswordArray(passwordArray.filter(item=>item.id!==id))
    await fetch(`${backendurl}/api/passwords`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, userId }),  // Include userId to prevent unauthorized deletion
    })
    
    // localStorage.setItem("passwords", JSON.stringify([...passwordArray, form]));
    
    // setPasswordArray([...passwordArray, {...form,id:uuidv4()}]);
    // console.log([...passwordArray, form]);
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    toast("✅ Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const showPass = () => {
    if (ref.current.src.includes("/icons/hide.png")) {
      ref.current.src = "../icons/show.png";
      passRef.current.type = "password";
    } else {
      ref.current.src = "../icons/hide.png";
      passRef.current.type = "text";
    }
  };

  return (
    <div className="bg">
    <Navbar/>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="p-2 pt-8 md:my-container min-h-[90vh]">
        <h1 className="text-4xl text font-bold text-center">
          <span className="text-purple-700">&lt;</span>
          Pass
          <span className="text-purple-700">MAN/&gt;</span>
        </h1>
        <p className="text-purple-900 text-lg text-center">
          Your own password manager
        </p>
        <div className="text-black p-6 flex flex-col items-center gap-8">
          <input
            className="rounded-full border border-purple-500 w-full text-black py-1 px-4"
            type="text"
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            name="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-2">
            <input
              value={form.username}
              onChange={handleChange}
              className="rounded-full border border-purple-500 w-full text-black py-1 px-4"
              type="text"
              placeholder="Enter Username"
              name="username"
            />
            <div className="relative">
              <input
                ref={passRef}
                value={form.password}
                onChange={handleChange}
                className="rounded-full border border-purple-500 w-full text-black py-1 px-4"
                type="password"
                placeholder="Enter Password"
                name="password"
              />
              <span
                className="absolute cursor-pointer top-[3px] right-[3px]"
                onClick={showPass}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={30}
                  src="../icons/show.png"
                  alt=""
                />
              </span>
            </div>
          </div>
          <button
            className="flex justify-center items-center bg-purple-400 rounded-full border-2 border-purple-900 px-3 py-1 w-fit hover:bg-purple-300 gap-2"
            onClick={savePass}
          >
            <lord-icon
              src="https://cdn.lordicon.com/sbnjyzil.json"
              trigger="hover"
              stroke="bold"
              state="hover-swirl"
              colors="primary:#000000,secondary:#000000"
            ></lord-icon>
            <span className="font-bold">Save</span>
          </button>
        </div>

        <div className="passwords">
          <h1 className="font-bold text-2xl py-4">Your Passwords</h1>
          {passwordArray.length === 0 && <div>No passwords to show!</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full overflow-hidden rounded-md mb-10">
              <thead className="bg-purple-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-purple-200">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/fjvfsqea.json"
                              trigger="hover"
                              stroke="bold"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              colors="primary:#000000,secondary:#000000"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          {item.username}
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/fjvfsqea.json"
                              trigger="hover"
                              stroke="bold"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              colors="primary:#000000,secondary:#000000"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          {"*".repeat(item.password.length)}
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/fjvfsqea.json"
                              trigger="hover"
                              stroke="bold"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              colors="primary:#000000,secondary:#000000"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          <span
                            className="cursor-pointer mx-2"
                            onClick={() => editPass(item.id)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/exymduqj.json"
                              trigger="hover"
                              stroke="bold"
                              state="hover-line"
                              colors="primary:#000000,secondary:#000000"
                              style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                          </span>
                          <span
                            className="cursor-pointer mx-2"
                            onClick={() => delPass(item.id)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/hwjcdycb.json"
                              trigger="hover"
                              stroke="bold"
                              state="hover-line"
                              colors="primary:#000000,secondary:#000000"
                              style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Manager;
