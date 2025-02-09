import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[confirmPass,setConfirmPass]=useState("")
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(confirmPass!=password)
        {
          alert("Passwords not matching")
          return
        }
      const result = await signUpNewUser(email, password); // Call context function
      
      if (result.success) {
        alert("Account created successfully!")
        navigate("/dashboard"); // Navigate to dashboard on success
      } else {
        setError(result.error.message); // Show error message on failure
      }
    } catch (err) {
      setError("An unexpected error occurred."); // Catch unexpected errors
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="bg ph flex items-center justify-center text-center text-xl">
      <form onSubmit={handleSignUp} className="m-auto">
        <div>
        <h2 className="font-bold pb-2 ">Welcome!</h2>
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
          <div className="flex flex-col">
            {/* <label htmlFor="Password">Password</label> */}
            <input
              onChange={(e) => setConfirmPass(e.target.value)}
              className="p-2 mt-2 border rounded-lg border-purple"
              type="password"
              name="confirm-pass"
              id="confirm-pass"
              placeholder="Confirm Password"
            />
          </div>
        </div>
        <div className="p-3">
          <button type="submit" disabled={loading} className="w-35 px-2 text-purple-500 font-semibold hover:text-purple-800">
            Sign Up
          </button>
        </div>
        <div className="mb-3">
          <br />
          <p>
            Already have an account? <Link to="/" className=" px-2 text-purple-500 font-semibold hover:text-purple-800">Sign in</Link>
          </p>
        </div>
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
