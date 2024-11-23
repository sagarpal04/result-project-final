import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ResultPage = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    enrollment: "",
    dob: "",
    subjects: [],
  });
  const { id } = useParams();

  const fetchStudentData = async () => {
    try {
      const studentResponse = await fetch(
        `http://localhost:5000/studentinfo/${id}`
      );
      const studentInfo = await studentResponse.json();

      if (studentInfo.enrollment_number) {
        const dob = new Date(studentInfo.date_of_birth).toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        setStudentData((prev) => ({
          ...prev,
          name: studentInfo.name,
          enrollment: studentInfo.enrollment_number,
          dob,
        }));
      } else {
        setStudentData(null);
      }

      const resultResponse = await fetch(
        `http://localhost:5000/resultinfo/${id}`
      );
      const resultInfo = await resultResponse.json();

      if (Array.isArray(resultInfo)) {
        setStudentData((prev) => ({
          ...prev,
          subjects: resultInfo,
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStudentData(null);
    }
  };
  useEffect(() => {
    fetchStudentData();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {studentData ? (
        <Result studentData={studentData} />
      ) : (
        <div>
          <p>No data available, please try again.</p>
          <button
            onClick={fetchStudentData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export const Result = ({ studentData }) => {
  const { name, enrollment, dob, subjects } = studentData;
  const total = subjects.length * 100;
  const sum = subjects.reduce((acc, curr) => acc + curr.marks, 0);
  const percentage = (sum / total) * 100;
  const overallStatus = subjects.every((subject) => subject.status === "Pass")
    ? "Pass"
    : "Fail";
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Result
      </h2>
      <div className="text-gray-600 mb-4">
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Enrollment Number:</strong> {enrollment}
        </p>
        <p>
          <strong>Date of Birth:</strong> {dob}
        </p>
      </div>

      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
              Subject
            </th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
              Marks
            </th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                {subject.subject}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.marks}
              </td>
              <td
                className={`border border-gray-300 px-4 py-2 ${
                  subject.status === "Pass" ? "text-green-600" : "text-red-600"
                }`}
              >
                {subject.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-gray-600 mb-2">
        <strong>Percentage:</strong> {percentage}%
      </p>
      <p className="text-gray-600">
        <strong>Overall Status:</strong>{" "}
        <span
          className={`font-bold ${
            overallStatus === "Pass" ? "text-green-600" : "text-red-600"
          }`}
        >
          {overallStatus}
        </span>
      </p>
    </div>
  );
};

export default ResultPage;
