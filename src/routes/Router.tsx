import { Route, Routes } from "react-router-dom";

import BaseLayout from "./layout/BaseLayout";

import Error from "@/pages/Error";
import Interview from "@/pages/InterviewPage/Interview";
import Report from "@/pages/ReportPage/Report";
import Main from "@/pages/MainPage/Main";
import JobPostingDetails from "@/pages/JobPostingDetails/JobPostingDetails";
import Policy from "@/pages/Policy/Policy";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Main />} />
        <Route path="/jobs/:id" element={<JobPostingDetails />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
      </Route>

      <Route path="/policy" element={<Policy />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Router;
