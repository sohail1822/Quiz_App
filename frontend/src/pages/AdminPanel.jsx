import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";

const AdminPanel = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", num_questions: "", total_score: "", duration: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:8000/api/quizzes/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
    })
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch(() => dispatch(showSnackbar("Failed to fetch quizzes ❌")));
  }, [dispatch]);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/quizzes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
      body: JSON.stringify(newQuiz),
    });

    if (response.ok) {
      const createdQuiz = await response.json();
      setQuizzes([...quizzes, createdQuiz]);
      setNewQuiz({ title: "", num_questions: "", total_score: "", duration: "" });
      dispatch(showSnackbar("Quiz created successfully! ✅"));
    } else {
      dispatch(showSnackbar("Failed to create quiz ❌"));
    }
  };

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
      <h2>Admin Panel - Manage Quizzes</h2>

      <div className="card p-4 mt-4 shadow">
        <h5>Create a New Quiz</h5>
        <form onSubmit={handleCreateQuiz}>
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Quiz Title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="No. of Questions"
                value={newQuiz.num_questions}
                onChange={(e) => setNewQuiz({ ...newQuiz, num_questions: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Total Score"
                value={newQuiz.total_score}
                onChange={(e) => setNewQuiz({ ...newQuiz, total_score: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Duration (min)"
                value={newQuiz.duration}
                onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                ➕ Add Quiz
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="list-group mt-4">
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

export default AdminPanel;
