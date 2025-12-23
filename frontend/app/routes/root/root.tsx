
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div>
      <h1>Root Layout</h1>
      <Outlet /> {/* This is where nested routes like /root/home will render */}
    </div>
  );
}
