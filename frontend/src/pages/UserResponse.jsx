import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserResponse = () => {
  const { quizId, participantId } = useParams();
  const [responses, setResponses] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/quizzes/${quizId}/response/${participantId}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setResponses(data.responses || []);
        setTotalScore(data.score_obtained || 0);
        setMaxScore(data.total_score || 0);
        setLoading(false);
      });
  }, [quizId, participantId]);

  return (
    <div className="container mt-5 p-5">
      <h2>Participant Responses</h2>

      {loading ? (
        <p>Loading responses...</p>
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
                  {resp.question.options.find((opt) => opt.is_correct)?.option}
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

export default UserResponse;
