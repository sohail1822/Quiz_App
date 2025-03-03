import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";
import QuestionForm from "../components/QuestionForm";

const AddQuestion = () => {
  const { quizId } = useParams();
  const [numQuestions, setNumQuestions] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizDetails = async () => {
      const response = await fetch(`http://localhost:8000/api/quizzes/${quizId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNumQuestions(data.num_questions);

        // Fill the form with existing questions or placeholders
        const loadedQuestions = data.questions.map((q, index) => ({
          id: q.id,
          number: index + 1,
          question: q.text,
          marks: q.marks,
          options: q.options.map((opt) => ({
            id: opt.id,
            option: opt.text,
            is_correct: opt.is_correct,
          })),
        }));

        while (loadedQuestions.length < data.num_questions) {
          loadedQuestions.push({
            number: loadedQuestions.length + 1,
            question: "",
            marks: 5,
            options: [
              { option: "", is_correct: false },
              { option: "", is_correct: false },
            ],
          });
        }

        setQuestions(loadedQuestions);
      } else {
        dispatch(showSnackbar("Failed to fetch quiz details ❌"));
      }
    };

    fetchQuizDetails();
  }, [quizId, dispatch]);

  const handleSubmitQuestion = async (questionData) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = questionData;
    setQuestions(updatedQuestions);

    const response = await fetch(`http://localhost:8000/api/quizzes/${quizId}/add_question/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
      body: JSON.stringify(questionData),
    });

    if (response.ok) {
      dispatch(showSnackbar(`Question ${currentQuestionIndex + 1} saved successfully! ✅`));

      if (currentQuestionIndex < numQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        dispatch(showSnackbar("All questions added! Ready to submit. ✅"));
      }
    } else {
      dispatch(showSnackbar("Failed to add question ❌"));
    }
  };

  const handleSubmitQuiz = () => {
    dispatch(showSnackbar("Quiz submission successful! ✅"));
    navigate("/admin/manage-quizzes");
  };

  return (
    <div className="container mt-5 p-5">
      <h2>Adding Questions for Quiz {quizId}</h2>

      {questions.length > 0 && (
        <>
          <QuestionForm
            questionNumber={currentQuestionIndex + 1}
            initialData={questions[currentQuestionIndex]}
            onSubmit={handleSubmitQuestion}
          />

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-secondary"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </button>
            {currentQuestionIndex === numQuestions - 1 ? (
              <button className="btn btn-success" onClick={handleSubmitQuiz}>
                Submit Quiz
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AddQuestion;
