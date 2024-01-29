import Nav from "../components/Navb";
import Dandd from "../components/Dandd";
import { useEffect, useState } from "react";

function Home({ user }) {
  console.log(user);
  return (
    <div className="flex flex-col gap-10 ">
      {user ? <Dandd /> : <h1>Login to Colorize Image</h1>}
    </div>
  );
}

export default Home;
