import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //LOGIN API CALL
    try {
      const response = await axiosInstance.post("/login", {
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
      {/* Background UI Elements */}
      <div className="login-ui-box right-10 -top-40"></div>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2"></div>

      {/* Main Container */}
      <div className="container h-screen flex flex-col lg:flex-row items-center justify-center px-4 lg:px-20 mx-auto">
        {/* Left Section (Image and Text) */}
        <div className="w-full lg:w-2/4 h-[50vh] lg:h-[90vh] flex items-end my-bg-image bg-cover bg-center rounded-lg p-6 lg:p-10 z-50">
          <div>
            <h4 className="text-3xl lg:text-5xl text-white font-semibold leading-[40px] lg:leading-[58px]">
              Capture Your <br />
              Journeys
            </h4>
            <p className="text-sm lg:text-[15px] text-white leading-5 lg:leading-6 pr-4 lg:pr-7 mt-2 lg:mt-4">
              Record your travel experiences and memories in your personal
              travel journey.
            </p>
          </div>
        </div>

        {/* Right Section (Login Form) */}
        <div className="w-full lg:w-2/4 h-auto lg:h-[75vh] bg-white rounded-lg lg:rounded-r-lg relative p-6 lg:p-16 shadow-lg shadow-cyan-200/20 mt-6 lg:mt-0">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-4 lg:mb-7">Login</h4>
            <input
              type="text"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
              placeholder="Email"
              className="input-box w-full mb-4 lg:mb-6"
            />
            <PasswordInput
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />

            {error && <p className="text-xs text-red-500 pb-1">{error}</p>}

            <button type="submit" className="btn-primary w-full mt-4 lg:mt-6">
              LOGIN
            </button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="button"
              className="btn-primary btn-light w-full"
              onClick={() => {
                navigate("/signUp");
              }}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
