import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentLogin from "./components/StudentLogin";
import ResultPage from "./components/ResultPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/enrollment/:id" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default App;
