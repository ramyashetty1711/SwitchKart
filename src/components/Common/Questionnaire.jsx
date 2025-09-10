import React from "react";

const Questionnaire = ({ questionData, setCondition, onNext }) => {
  const { key, img, question, options } = questionData;

  const handleAnswer = (option) => {
    setCondition((prev) => ({
      ...prev,
      [key]: { value: option.value, discount: option.discount },
    }));
    onNext();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {img && <img src={img} alt={key} className="w-20 h-20" />}
      <p className="text-gray-700 font-medium text-center">{question}</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            className={`px-4 py-2 rounded-md text-white ${
              option.color
            } hover:opacity-90`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Questionnaire;
