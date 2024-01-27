import React, { useState } from "react";
import Nav from "../components/Navb";
import { redirect } from "react-router-dom";
import axios from 'axios';

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirects, setRedirects] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const content = await response.json();

    setRedirects(true);
    props.setName(content.name);
  };

  if (redirects) {
    return redirect("/");
  }

  return (
    <>
      <Nav />
      <div className="-z-10 shadow-md border-2 w-[25rem] felx  flex-col p-5 justify-center h-[25rem] px-10 absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] ">
        <form
          onSubmit={submit}
          className="flex flex-col justify-center items-center gap-y-4 "
        >
          <h2 className="h3 mb-3 ">Please Log in</h2>
          <input
            type="email"
            className="border-2 border-black rounded-md px-2 py-1 w-72"
            placeholder="Email address"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type={showPass ? "text" : "password"}
            className="border-2 border-black rounded-md px-2 py-1 w-72"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              value={showPass}
              onChange={() => {
                setShowPass(!showPass);
              }}
            />
            Show password
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-4 py-2"
            type="submit"
          >
            Log in
          </button>
        </form>
        <p className="text-center mt-8">
          Not signd up yet?{" "}
          <a
            href="/signup"
            className="font-bold hover:underline cursor-pointer"
          >
            Sign up
          </a>
        </p>
      </div>
    </>
  );
};

export default Login;
