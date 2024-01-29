import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import { useState, useEffect } from "react";

import Signup from "./pages/Signup";
import Nav from "./components/Navb";

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch("http://127.0.0.1:8000/api/user", {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Basic ${credentials}`,
        },
        credentials: "include",
      });

      const token = await response.json();
      console.log(token);

      setUser(token);
    })();
  });
  return (
    <div className=" container ">
      <BrowserRouter>
        <Nav user={user} setUser={setUser} />
        <Routes>
          <Route index element={<Home user={user} />} />
          <Route path="login" element={<Login setUser={setUser} />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
