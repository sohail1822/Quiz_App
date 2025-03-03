import React, { useState, useEffect } from "react";

const QuestionForm = ({ questionNumber, initialData, onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ option: "", is_correct: false }]);
  const [marks, setMarks] = useState(5);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || "");
      setMarks(initialData.marks || 5);
      setOptions(
        initialData.options.length > 0
          ? initialData.options
          : [
              { option: "", is_correct: false },
              { option: "", is_correct: false },
            ]
      );
    }
  }, [initialData]);

  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index].option = text;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (index) => {
    const newOptions = options.map((opt, i) => ({ ...opt, is_correct: i === index }));
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { option: "", is_correct: false }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!options.some((opt) => opt.is_correct)) {
      alert("Select a correct answer before submitting!");
      return;
    }

    onSubmit({ question, options, number: questionNumber, marks });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5>Question {questionNumber}</h5>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      <label className="form-label">Options:</label>
      {options.map((option, index) => (
        <div key={index} className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            value={option.option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
          />
          <div className="input-group-text">
            <input
              type="radio"
              name="correctOption"
              checked={option.is_correct}
              onChange={() => handleCorrectOptionChange(index)}
            />
          </div>
          {options.length > 2 && (
            <button type="button" className="btn btn-danger" onClick={() => removeOption(index)}>
              ✖
            </button>
          )}
        </div>
      ))}
      <button type="button" className="btn btn-secondary mt-2" onClick={addOption}>
        ➕ Add Option
      </button>
      <br />
      <label className="form-label mt-2">Marks:</label>
      <input
        type="number"
        className="form-control mb-3"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary w-100">
        Save Question
      </button>
    </form>
  );
};

export default QuestionForm;
