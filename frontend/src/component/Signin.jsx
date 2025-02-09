import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { session, error } = await signInUser(email, password); // Use your signIn function

    if (error) {
      setError(error); // Set the error message if sign-in fails

      // Set a timeout to clear the error message after a specific duration (e.g., 3 seconds)
      setTimeout(() => {
        setError("");
      }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      // Redirect or perform any necessary actions after successful sign-in
      navigate("/dashboard");
    }

    if (session) {
      closeModal();
      setError(""); // Reset the error when there's a session
    }
  };

  return (
    <div className="bg ph flex items-center justify-center text-center text-xl">
      <form onSubmit={handleSignIn} className="mb-3">
        <h2 className="font-bold pb-2 ">Sign in</h2>
        <div className="flex flex-col">
          {/* <label htmlFor="Email">Email</label> */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 mt-2 border rounded-lg border-purple"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col">
          {/* <label htmlFor="Password">Password</label> */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 mt-2 border rounded-lg border-purple"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <div className="p-3">
        <button className="w-35 px-2 text-purple-500 font-semibold hover:text-purple-800">Sign In</button>
        </div>
        <br />
        <p>
          Don't have an account yet? <Link className="px-2 text-purple-500 font-semibold hover:text-purple-800" to="/signup">Sign up</Link>
        </p>
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
        <br />
      </form>
    </div>
  );
};

export default Signin;