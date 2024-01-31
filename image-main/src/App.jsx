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
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Basic ${credentials}`,
          },
          credentials: "include",
        });
  
        if (response.ok) {
          const userData = await response.json(); // await the json() method
          setUser(userData);
          console.log(userData);
        } else {
          console.error(`Failed to fetch user data. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);
  
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
