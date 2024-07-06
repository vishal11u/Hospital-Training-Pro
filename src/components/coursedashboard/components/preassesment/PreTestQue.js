import React, { useEffect, useState } from "react";

function PreTestQue({
  handleOptionSelect,
  selectedOptions,
  language,
  preAssesmentList,
}) {
  const optionLabels = ["A", "B", "C", "D"];
  const [questions, setQuestions] = useState([]);

  const formatQuestions = (assDetails) => {
    if (!assDetails || !Array.isArray(assDetails)) return [];
    return assDetails
      .map((detail) => {
        if (!detail || !detail.engAss) return null;
        return {
          id: detail.assessmentDetails,
          en: {
            question: detail.engAss.questionEnglish,
            options: detail.engAss.answerChoices,
          },
        };
      })
      .filter(Boolean); // Remove any null entries
  };

  useEffect(() => {
    if (
      preAssesmentList &&
      preAssesmentList[0] &&
      preAssesmentList[0].assDetails
    ) {
      const formattedQuestions = formatQuestions(
        preAssesmentList[0].assDetails
      );
      setQuestions(formattedQuestions);
    }
  }, [preAssesmentList]);

  return (
    <div className="w-full space-y-4 px-3">
      {questions.length > 0 &&
        questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="w-full border p-3 space-y-2 rounded-lg shadow-lg"
          >
            <h2 className="text-[16px] font-semibold">
              {qIndex + 1}. {question.en.question}
            </h2>
            <ul className="space-y-2">
              {Object.entries(question.en.options).map(
                ([optionKey, optionValue], oIndex) => (
                  <li key={optionKey}>
                    <label className="flex items-center w-full gap-x-2">
                      <button
                        type="button"
                        className={`h-7 px-[9px] text-[12px] flex items-center mt-0.5 font-medium justify-center text-center rounded-full border-[1.5px] ${
                          selectedOptions &&
                          selectedOptions.some(
                            (option) =>
                              option.assessmentDetailId.id === question.id &&
                              option.choices[0] === oIndex + 1
                          )
                            ? "bg-[#15A34F] text-white"
                            : "border-[#15A34F] text-[#15A34F]"
                        }`}
                        onClick={() =>
                          handleOptionSelect(question.id, oIndex, question)
                        }
                      >
                        {optionLabels[oIndex]}
                      </button>
                      <p className="text-[14px] font-medium pt-[1px] text-[#666666]">
                        {optionValue}
                      </p>
                    </label>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default PreTestQue;