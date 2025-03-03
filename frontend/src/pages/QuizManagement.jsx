import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:8000/api/quizzes/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
    })
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch(() => dispatch(showSnackbar("Failed to fetch quizzes ❌")));
  }, [dispatch]);

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    const response = await fetch(`http://localhost:8000/api/quizzes/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
    });

    if (response.ok) {
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
      dispatch(showSnackbar("Quiz deleted successfully! ✅"));
    } else {
      dispatch(showSnackbar("Failed to delete quiz ❌"));
    }
  };

  return (
    <div className="container mt-5 p-5">
      <h2>Manage Quizzes</h2>
      <div className="list-group">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{quiz.title}</strong> (Total Score: {quiz.total_score}, Duration: {quiz.duration} min)
              </div>
              <div>
                <Link to={`/admin/participants/${quiz.id}`} className="btn btn-sm btn-primary me-2">
                  View Participants
                </Link>
                <Link to={`/admin/add-question/${quiz.id}`} className="btn btn-sm btn-warning me-2">
                  Add Questions
                </Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteQuiz(quiz.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-3">No quizzes available.</p>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;
