import React from 'react';

function Module_PreAsses_Que({ handleOptionSelect, selectedOptions, questions, language }) {
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className='w-full space-y-4 px-3'>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className='w-full border p-3 space-y-2 rounded-lg shadow-lg'>
          <h2 className='text-[16px] font-semibold'>{qIndex + 1}. {question[language].question}</h2>
          <ul className='space-y-2'>
            {Object.entries(question[language].options).map(([optionKey, optionValue], oIndex) => (
              <li key={optionKey} className=''>
                <label className='flex items-center w-full gap-x-2'>
                  <button
                    type='button'
                    className={`h-7 px-[9px] text-[12px] flex items-center mt-0.5 font-medium justify-center text-center rounded-full border-[1.5px] ${selectedOptions[question.id] === oIndex + 1 ? 'bg-[#15A34F] text-white' : 'border-[#15A34F]'}`}
                    onClick={() => handleOptionSelect(question.id, oIndex)}
                  >
                    {optionLabels[oIndex]}
                  </button>
                  <p className='text-[14px] font-medium pt-[1px] text-[#666666]'>{optionValue}</p>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Module_PreAsses_Que;
