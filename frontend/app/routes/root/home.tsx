import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function meta() {
  return [
    { title: "TaskHub" },
    { name: "description", content: "welcome to TaskHub" },
  ];
}

const Homepage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-8">
      <Link to="/sign-in"><Button className="bg-blue-500 text-white">Login</Button></Link>
      <Link to="/sign-up"><Button className="bg-blue-500 text-white">Sign Up</Button></Link>
    </div>
    
  );
};

export default Homepage;
