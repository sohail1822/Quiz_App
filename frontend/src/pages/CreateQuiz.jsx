import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [totalScore, setTotalScore] = useState(100);
  const [duration, setDuration] = useState(30);
  const dispatch = useDispatch();


  

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/quizzes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
      body: JSON.stringify({ title, num_questions: numQuestions, total_score: totalScore, duration }),
    });

    if (response.ok) {
      dispatch(showSnackbar({message:"Quiz created successfully! 🎉",severity:"success"}));
      setTitle("");
      setNumQuestions(5);
      setTotalScore(100);
      setDuration(30);
    } else {
      dispatch(showSnackbar({message:"Failed to create quiz ❌",severity:"error"}));
    }
  };

  return (
    <div className="container mt-5 p-5">
      <h2>Create New Quiz</h2>
      <form onSubmit={handleCreateQuiz}>
        <div className="mb-3">
          <label className="form-label">Quiz Title</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Questions</label>
          <input type="number" className="form-control" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Score</label>
          <input type="number" className="form-control" value={totalScore} onChange={(e) => setTotalScore(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Duration (Minutes)</label>
          <input type="number" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
