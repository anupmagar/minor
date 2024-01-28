import Nav from "../components/Navb";
import Dandd from "../components/Dandd";
import { useEffect,useState } from "react";

function Home() {
  const [isUser,setIsUser] = useState(false)
  // useEffect(()=>{
  //   async ()=>{
  //     const response = await fetch('http://127.0.0.1:8000/api/user',{
  //       headers:{'Content-Type': 'application/json'},
  //       credentials: 'include',
  //     });
  //     const content = await response.json();
  //     console.log(content)
  //   }
  // })

  // user = fetch('http://127.0.0.1:8000/api/user')
  return (
    <div className="flex flex-col gap-10 ">
      <Nav isUser= {isUser} />
      <Dandd />
    </div>
  );
}

export default Home;
