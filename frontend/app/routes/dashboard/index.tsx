import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // Example: fetch data from your backend
  // const response = await fetch("http://localhost:5000/api/dashboard");
  // const data = await response.json();
  
  return { message: "Dashboard data" };
}

const Dashboard = () => {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Use your loaded data here */}
    </div>
  );
};

export default Dashboard;