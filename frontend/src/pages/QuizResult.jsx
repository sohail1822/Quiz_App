import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuizResult = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/my-quizzes/${id}/response/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch quiz results.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Quiz Response:", data);
        setResponses(data.responses || []);
        setTotalScore(data.score_obtained || 0);
        setMaxScore(data.total_score || 0);
        setQuizTitle(data.quiz_title || "Quiz");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load results. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="container mt-5 p-5">
      <h2>{quizTitle} - Results</h2>

      {loading ? (
        <p>Loading results...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div>
          <h4>
            Score: <span className="text-primary">{totalScore}</span> / {maxScore}
          </h4>

          <ul className="list-group mt-3">
            {responses.map((resp, index) => (
              <li key={resp.id} className="list-group-item">
                <strong>
                  Q{index + 1}: {resp.question.question}
                </strong>
                <br />
                <span className={resp.is_correct ? "text-success" : "text-danger"}>
                  {resp.is_correct ? "✅ Correct" : "❌ Incorrect"}
                </span>
                <br />
                <small>
                  <strong>Selected:</strong>{" "}
                  {resp.selected_option ? resp.selected_option.option : "Not Answered"}
                </small>
                <br />
                <small>
                  <strong>Correct Answer:</strong>{" "}
                  {resp.question.options.find((opt) => opt.is_correct)?.option || "N/A"}
                </small>
                <br />
                <span className="badge bg-info">Marks: {resp.marks_obtained}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizResult;
