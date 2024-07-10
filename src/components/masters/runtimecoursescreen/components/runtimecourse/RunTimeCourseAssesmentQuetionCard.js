import React, { useState } from 'react';
import removeIcon from '../../../../../assets/masters/remove.svg';
import correctAnswerIcon from '../../../../../assets/masters/check.svg';
import DragIcon from '../../../../../assets/masters/drag.svg';
import { Tooltip } from '@mui/material';
import EmptyOptions from '../../../../../assets/masters/uncheck.svg';

export default function RunTimeCourseAssesmentQuetionCard({
    questionData,
    setQuestionData,
    handleRemoveQuestion,
}) {
    // console.log("ddccddc", questionData);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);

    const handleDragStart = (index) => {
        setSelectedCardIndex(index);
    };

    const handleDragEnter = (index) => {
        if (index !== selectedCardIndex && selectedCardIndex !== null) {
            const newQuestionData = [...questionData];
            const [draggedItem] = newQuestionData.splice(selectedCardIndex, 1);
            newQuestionData.splice(index, 0, draggedItem);
            setQuestionData(newQuestionData);
            setSelectedCardIndex(index);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = () => {
        setSelectedCardIndex(null);
    };

    return (
        <div className=''>
            {questionData && questionData.length > 0 ? (
                <div className='rounded-md h-[46.5vh] -mt-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500'>
                    {questionData.map((question, index) => (
                        <div
                            key={index}
                            className='border w-full mt-2.5 rounded-md shadow border-[#CCCCCC]'
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className='bg-gray-100 mb-2 rounded-md'>
                                <div className='flex justify-between p-2'>
                                    <div className='flex items-center'>
                                        <button><img className='w-7' src={DragIcon} alt='drag' /></button>
                                        <span className='font-medium capitalize text-[16px]'>Question: {index + 1}</span>
                                    </div>
                                    <div>
                                        <Tooltip title={'Delete Question'} arrow>
                                            <button
                                                className='rounded-md text-[12px] text-red-500'
                                                type='button'
                                                onClick={() => handleRemoveQuestion(index)}
                                            >
                                                <img className='w-[24px]' src={removeIcon} alt='remove' />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                                <hr className='bg-[#CCCCCC] h-[1px]' />
                            </div>
                            <div className='p-2'>
                                <h3 className='font-semibold text-[14px] -mt-2'>
                                    {question.assessmentEnglish?.questionEnglish}
                                </h3>
                                <div className=''>
                                    {Object.keys(question.assessmentEnglish.answerChoices).map((key, optionIndex) => (
                                        <div key={optionIndex} className='flex items-center gap-x-4'>
                                            <div className='flex items-center gap-x-3 border border-[#CCCCCC] rounded-md p-2 mt-2'>
                                                <div className=''>
                                                    {question.correctChoices?.includes(optionIndex + 1) ? (
                                                        <img className='w-5' src={correctAnswerIcon} alt='correct' />
                                                    ) : (
                                                        <img className='w-5' src={EmptyOptions} alt='empty' />
                                                    )}
                                                </div>
                                                <p className='text-[12px] font-normal text-[#525252]'>
                                                    {question.assessmentEnglish.answerChoices[key]}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* {Object.keys(question.assessmentEnglish.answerChoices).map((key, optionIndex) => (
                                        <div key={optionIndex} className='flex items-center gap-x-4'>
                                            <div className='flex items-center gap-x-3 border border-[#CCCCCC] rounded-md p-2 mt-2'>
                                                <div className=''>
                                                    {question.coorectChoices?.includes(optionIndex + 1) ? (
                                                        <img className='w-5' src={correctAnswerIcon} alt='correct' />
                                                    ) : (
                                                        <img className='w-5' src={EmptyOptions} alt='empty' />
                                                    )}
                                                </div>
                                                <p className='text-[12px] font-normal text-[#525252]'>
                                                    {question.assessmentEnglish.answerChoices[key]}
                                                </p>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex justify-center items-center mt-[40%]'>
                    <p className='text-center text-[16px] font-semibold'>No Question Found</p>
                </div>
            )}
        </div>
    );
}