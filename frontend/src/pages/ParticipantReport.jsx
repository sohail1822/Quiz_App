import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ParticipantReport = () => {
  const { quizId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/quizzes/${quizId}/participants/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch participants.");
        return res.json();
      })
      .then((data) => {
        setParticipants(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [quizId]);

  return (
    <div className="container mt-5 p-5">
      <h2>Participants Report</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th># Rank</th>
              <th>Participant</th>
              <th>Score</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {participants.length > 0 ? (
              participants.map((participant, index) => (
                <tr key={participant.id}>
                  <td>{index + 1}</td>
                  <td>{participant.username}</td>
                  <td>
                    {participant.score} / {participant.total_score}
                  </td>
                  <td>
                    <span className={`badge ${participant.status === "completed" ? "bg-success" : "bg-warning"}`}>
                      {participant.status}
                    </span>
                  </td>
                  <td>
                    {participant.status === "completed" ? (
                      <Link to={`/quiz/${quizId}/participant/${participant.user}`} className="btn btn-primary btn-sm">
                        View Responses
                      </Link>
                    ) : (
                      <span className="text-muted">In Progress</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParticipantReport;
