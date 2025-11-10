import React from "react";
import { Button } from "@/components/ui/button";

export function meta() {
  return [
    { title: "TaskHub" },
    { name: "description", content: "welcome to TaskHub" },
  ];
}

const Homepage = () => {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
};

export default Homepage;
