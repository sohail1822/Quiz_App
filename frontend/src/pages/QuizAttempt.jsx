import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";

const QuizAttempt = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/my-quizzes/${id}/start/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data);
        console.log(data);
        if(data.detail==="You have already completed this quiz."){navigate(`/quiz/result/${data.attempt_id}`)}
        setTimeLeft(data.duration * 60); // Convert minutes to seconds
      });
  }, [id]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when time runs out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = async () => {
    const response = await fetch(`http://localhost:8000/api/my-quizzes/${quiz.attempt_id}/submit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access-token")}` },
      body: JSON.stringify({ responses }),
    });

    if (response.ok) {
      dispatch(showSnackbar("Quiz submitted successfully! ✅"));
      navigate(`/quiz/result/${quiz.attempt_id}`);
    } else {
      dispatch(showSnackbar("Failed to submit quiz ❌"));
    }
  };

  const handleOptionSelect = (questionId, optionId) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="container mt-5 p-5">
      <h2>{quiz?.title}</h2>

      {/* Timer Display */}
      {timeLeft !== null && (
        <div className={`alert ${timeLeft <= 30 ? "alert-danger" : "alert-info"}`}>
          Time Left: <strong>{formatTime(timeLeft)}</strong>
        </div>
      )}

      {/* Horizontal Navigation Bar */}
      {quiz && quiz.questions.length > 0 && (
        <div className="d-flex flex-wrap mb-4">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              className={`btn me-2 ${index === currentQuestionIndex ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => handleQuestionClick(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {quiz && quiz.questions.length > 0 && (
        <div className="card p-4 shadow">
          <h5>
            Q{currentQuestionIndex + 1}: {quiz.questions[currentQuestionIndex].text}
          </h5>
          <p className="text-muted">Marks: {quiz.questions[currentQuestionIndex].marks}</p>

          {quiz.questions[currentQuestionIndex].options.map((opt) => (
            <div key={opt.id} className="form-check">
              <input
                type="radio"
                name={`question-${quiz.questions[currentQuestionIndex].id}`}
                className="form-check-input"
                value={opt.id}
                checked={responses[quiz.questions[currentQuestionIndex].id] === opt.id}
                onChange={() => handleOptionSelect(quiz.questions[currentQuestionIndex].id, opt.id)}
              />
              <label className="form-check-label">{opt.text}</label>
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-secondary"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevious}
            >
              Previous
            </button>
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button className="btn btn-success" onClick={handleSubmit}>
                Submit Quiz
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
