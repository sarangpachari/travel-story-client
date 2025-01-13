import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Enter a your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //SIGNUP API CALL
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      //HANDLE SUCCESSFULL LOGIN RESPONSE
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      //HANDLE LOGIN ERROR
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    

    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      {/* Decorative UI Boxes */}
      <div className="login-ui-box right-10 -top-40"></div>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2"></div>

      {/* Main Container */}
      <div className="container h-screen flex flex-col md:flex-row items-center justify-center px-4 md:px-20 mx-auto">
        {/* Image Section */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-[90vh] flex items-end my-signup-img bg-cover bg-center rounded-lg p-6 md:p-10 z-50">
          <div>
            <h4 className="text-3xl md:text-5xl text-white font-semibold leading-[40px] md:leading-[58px]">
              Join The <br />
              Adventure
            </h4>
            <p className="text-sm md:text-[15px] text-white leading-6 pr-7 mt-4">
              Create an account to start documenting your travels and preserving
              your memories in your personal travel journal.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 h-auto md:h-[75vh] bg-white rounded-lg md:rounded-r-lg relative p-6 md:p-16 shadow-lg shadow-cyan-200/20 mt-6 md:mt-0">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">Sign Up</h4>

            {/* Full Name Input */}
            <input
              type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
              placeholder="Full Name"
              className="input-box w-full mb-4"
            />

            {/* Email Input */}
            <input
              type="text"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email"
              className="input-box w-full mb-4"
            />

            {/* Password Input */}
            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              className="w-full mb-4"
            />

            {/* Error Message */}
            {error && <p className="text-xs text-red-500 pb-1">{error}</p>}

            {/* Create Account Button */}
            <button type="submit" className="btn-primary w-full">
              CREATE ACCOUNT
            </button>

            {/* Divider */}
            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            {/* Login Button */}
            <button
              type="button"
              className="btn-primary btn-light w-full"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
