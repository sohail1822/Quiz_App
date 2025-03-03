import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/my-quizzes/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
    })
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  return (
    <div className="container mt-5 p-5">
      <h2>Available Quizzes</h2>
      <div className="list-group">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              to={
                quiz.status === "Start"
                  ? `/quiz/attempt/${quiz.id}`
                  : quiz.status === "Resume"
                  ? `/quiz/attempt/${quiz.id}`
                  : `/quiz/result/${quiz.attempt_id}`
              }
              className="list-group-item list-group-item-action d-flex justify-content-between"
            >
              <div>
                <strong>{quiz.title}</strong> (Total Score: {quiz.total_score}, Duration: {quiz.duration} min)
              </div>
              <span className={`badge ${quiz.status === "Start" ? "bg-primary" : quiz.status === "Resume" ? "bg-warning" : "bg-success"}`}>
                {quiz.status}
              </span>
            </Link>
          ))
        ) : (
          <p className="text-center mt-3">No quizzes available.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
