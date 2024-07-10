import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PreTestQue from './PreTestQue';

function PreLeftModel({
    handleSubmit,
    handleOptionSelect,
    selectedOptions,
    language,
    handleLanguageChange,
    languageAvailability,
    assesQuetions,
    preAssesmentList
}) {
    // const optionLabels = ["A", "B", "C", "D"];
    // const [questions, setQuestions] = useState([]);

    // const formatQuestions = (assDetails) => {
    //     if (!assDetails || !Array.isArray(assDetails)) return [];
    //     return assDetails
    //         .map((detail) => {
    //             if (!detail || !detail.engAss) return null;
    //             return {
    //                 id: detail.assessmentDetails,
    //                 en: {
    //                     question: detail.engAss.questionEnglish,
    //                     options: detail.engAss.answerChoices,
    //                 },
    //             };
    //         })
    //         .filter(Boolean); // Remove any null entries
    // };

    // useEffect(() => {
    //     if (
    //         preAssesmentList &&
    //         preAssesmentList[0] &&
    //         preAssesmentList[0].assDetails
    //     ) {
    //         const formattedQuestions = formatQuestions(
    //             preAssesmentList[0].assDetails
    //         );
    //         setQuestions(formattedQuestions);
    //     }
    // }, [preAssesmentList]);

    return (
        <>
            <div className='py-2.5 px-4 shadow flex items-center justify-between sticky top-0 left-0 bg-white z-50'>
                <div className=''>
                    <h1 className='font-semibold text-[18px]'>Pre Assessment</h1>
                    <p className='text-[14px] font-medium'>For Modules</p>
                </div>
                <button
                    type='button'
                    className='border border-[#15A34F] bg-[#D8FFE8] text-[16px] font-semibold text-[#15A34F] py-1.5 px-5 shadow transition-all hover:scale-[1.03] rounded-3xl'
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
            <Divider sx={{ borderRightWidth: 1.5, backgroundColor: 'black' }} orientation="horizontal" variant="middle" />
            <div className='pl-4 '>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={language === 'english'}
                            onChange={handleLanguageChange}
                            value="english"
                            disabled={!languageAvailability?.english}
                        />
                    }
                    label="English"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={language === 'hindi'}
                            onChange={handleLanguageChange}
                            value="hindi"
                            disabled={!languageAvailability?.hindi}
                        />
                    }
                    label="Hindi"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={language === 'local'}
                            onChange={handleLanguageChange}
                            value="local"
                            disabled={!languageAvailability?.local}
                        />
                    }
                    label="Local"
                />
            </div>
            <div>
                <PreTestQue
                    questions={assesQuetions}
                    selectedOptions={selectedOptions}
                    handleOptionSelect={handleOptionSelect}
                    language={language}
                    preAssesmentList={preAssesmentList}
                />
            </div>
        </>
    );
}

export default PreLeftModel;