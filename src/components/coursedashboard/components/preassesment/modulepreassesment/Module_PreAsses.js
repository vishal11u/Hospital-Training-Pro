import { Divider, FormControlLabel, Checkbox } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../../../http_Common';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { fetchAllModuleQuetions } from '../../../../../services/moduleassesment/ModulePreAssesment';
import Module_PreAsses_Que from './Module_PreAsses_Que';

function Module_PreAsses({
    modules
}) {
    const Modules = modules?.modules;
    console.log("dcbdcudchdc", Modules);

    const location = useLocation();
    const { course } = location.state || location.search;
    const AssignTrainingId = course?.assignTrainingId;
    const CourseId = course?.courseId;
    const [language, setLanguage] = useState("english");
    const [languageAvailability, setLanguageAvailability] = useState({
        english: false,
        hindi: false,
        local: false,
    });
    const [selectedOptions, setSelectedOptions] = useState({});
    const [assesQuetions, setAssesQuetions] = useState([]);
    const [detailsId, setDetailsId] = useState([]);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setSelectedOptions((prevState) => ({
            ...prevState,
            [questionId]: optionIndex + 1,
        }));
    };

    const handleSubmit = useCallback(async () => {
        const unansweredQuestions = assesQuetions.filter(
            (question) => selectedOptions[question.id] == null
        );
        const answeredCount = assesQuetions.length - unansweredQuestions.length;

        if (unansweredQuestions.length === 0) {
            const payload = {
                flag: 1,
                employeeId: { id: 4 },
                assignTrainingId: AssignTrainingId ? { id: AssignTrainingId } : null,
                courseId: CourseId ? { id: CourseId } : null,
                preAssessmentId: { id: 31 },
                assessmentDetails: assesQuetions.map((question, index) => {
                    return {
                        assessmentDetailId: { id: detailsId[index] },
                        choices: [selectedOptions[question.id]],
                    };
                }),
                isPreAss: true,
                moduleId: {
                    id: Modules[0]?.moduleid
                },
                isPostAss: false
            };

            try {
                const res = await axios.post(
                    `${API_BASE_URL}/training/saveAssessmentScore`,
                    payload
                );
                console.log(res);
                toast.success("Test submitted.");
                setTimeout(() => {
                    // setLoading(false);
                }, 1000);
            } catch (error) {
                toast.error(error.message);
                // setLoading(false);
            }
        } else {
            toast.warning(
                `You have answered ${answeredCount} out of ${assesQuetions.length} questions. Please answer all questions before submitting.`
            );
        }
    }, [assesQuetions, selectedOptions, AssignTrainingId, detailsId]);

    useEffect(() => {
        fetchAllModuleQuetions(AssignTrainingId, 31)
            .then((res) => {
                const parsedData = JSON.parse(res.result);
                const transformedData = parsedData.flatMap((item) =>
                    item.assDetails.map((detail, index) => ({
                        id: index + 1,
                        english: {
                            question: detail.engAss.questionEnglish,
                            options: detail.engAss.answerChoices,
                        },
                        hindi: detail.hindiAss?.questionHindi
                            ? {
                                question: detail.hindiAss.questionHindi,
                                options: detail.hindiAss.answerChoices,
                            }
                            : null,
                        local: detail.localAss?.questionLocal
                            ? {
                                question: detail.localAss.questionLocal,
                                options: detail.localAss.answerChoices,
                            }
                            : null,
                    }))
                );

                setAssesQuetions(transformedData);

                const Ids = parsedData.flatMap(item =>
                    item.assDetails.map(detail => detail.assessmentDetails)
                );
                setDetailsId(Ids);

                setLanguageAvailability({
                    english: true,
                    hindi: transformedData.some((question) => question.hindi !== null),
                    local: transformedData.some((question) => question.local !== null),
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, [AssignTrainingId]);

    return (
        <>
            <div className='py-2.5 px-4 shadow flex items-center justify-between sticky top-0 left-0 bg-white'>
                <div className=''>
                    <h1 className='font-semibold text-[18px]'>Module Pre Assessment</h1>
                    <p className='text-[14px] font-medium'>For Topics</p>
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
                            disabled={!languageAvailability.english}
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
                            disabled={!languageAvailability.hindi}
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
                            disabled={!languageAvailability.local}
                        />
                    }
                    label="Local"
                />
            </div>
            <div>
                <Module_PreAsses_Que
                    questions={assesQuetions}
                    selectedOptions={selectedOptions}
                    handleOptionSelect={handleOptionSelect}
                    language={language}
                />
            </div>
        </>
    );
}

export default React.memo(Module_PreAsses);