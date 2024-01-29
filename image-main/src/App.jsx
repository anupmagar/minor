import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import { useState, useEffect } from "react";

import Signup from "./pages/Signup";
import Nav from "./components/Navb";

function App() {
  const [isUser, setIsUser] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch("http://127.0.0.1:8000/api/user", {
        headers: { "Content-Type": "application/json" ,
        "Authorization": `Basic ${credentials}`,
      },
        //credentials: 'include'
        
      });

      const content = await response.json();
      console.log(content)

      setIsUser(content.name);
      // localStorage.setItem(content)
    })();
  });
  return (
    <div className=" container ">
      <BrowserRouter>
        <Nav isUser={isUser} setIsUser={setIsUser} />
        <Routes>
          <Route index element={<Home isUser={isUser} />} />
          <Route path="login" element={<Login setIsUser={setIsUser} />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

