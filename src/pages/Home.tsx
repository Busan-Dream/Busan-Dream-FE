import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      Home
      <Link to="/interview">Interview</Link>
      <Link to="/report">Report</Link>
    </div>
  );
};

export default Home;
