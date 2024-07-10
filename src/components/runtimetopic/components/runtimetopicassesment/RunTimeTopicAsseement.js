import React, { useCallback, useState } from 'react'
import { toast } from 'sonner';
import CheckBoxField from '../../../../common/CommonCheckboxFeield';
import { useForm } from 'react-hook-form';

function RunTimeTopicAsseement() {
    const {
        control,
        register,
        // handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
        clearErrors,
        getValues,
    } = useForm({
        defaultValues: {
            English: true,
            Hindi: "",
            local: "",
        },
    });
    const optionLabels = ["A", "B", "C", "D"];
    const [questions, setQuestions] = useState([]);
    const [preAssesmentList, setPreAssesmentList] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(null);
    // const [videoStatus, setVideoStatus] = useState(null);

    const handleSubmit = useCallback(async () => {
        const unansweredQuestions = preAssesmentList.filter(
            (question) => selectedOptions[question.id] == null
        );

        const answeredCount = preAssesmentList.length - unansweredQuestions.length;
        if (unansweredQuestions.length > 0) {
            // const payload = {
            //     employeeId: { id: 3 },
            //     assignTrainingId: modules?.assignTrainingId
            //         ? { id: modules.assignTrainingId }
            //         : null,
            //     courseId: modules?.modules.length > 0 ? { id: modules.courseId } : null,
            //     preAssessmentId: { id: videoStatus.modulePreAssId },
            //     assessmentDetails: selectedOptions,
            //     moduleId: { id: videoStatus.moduleid },
            //     flag: 1,
            //     isPreAss:
            //         videoStatus.isModulePreAss && videoStatus.modulePreAssId !== null
            //             ? true
            //             : false,
            //     isPostAss:
            //         videoStatus.isModulePostAss && videoStatus.modulePostAssId !== null
            //             ? true
            //             : false,
            // };

            // saveCoursePreAssessment(payload)
            //     .then((res) => {
            //         if (res.statusCode === 200) {
            //             toast.success("Test submitted.");
            //             setPreAssesmentList([]);
            //         }
            //     })
            //     .catch((error) => {
            //         toast.error("Something Wrong");
            //     });
        } else {
            toast.warning(
                `You have answered ${answeredCount} out of ${preAssesmentList.length} questions. Please answer all questions before submitting.`
            );
        }
    }, [selectedOptions, selectedOptions]);

    const handleOptionSelect = useCallback((questionId, optionIndex, question) => {
        setSelectedOptions((prevState) => {
            const choiceId = optionIndex + 1;
            if (!Array.isArray(prevState)) {
                return [
                    {
                        assessmentDetailId: { id: questionId },
                        choices: [choiceId],
                    },
                ];
            }
            const existingIndex = prevState.findIndex(
                (item) => item.assessmentDetailId.id === questionId
            );
            if (existingIndex !== -1) {
                const updatedState = [...prevState];
                updatedState[existingIndex] = {
                    assessmentDetailId: { id: questionId },
                    choices: [choiceId],
                };
                return updatedState;
            } else {
                return [
                    ...prevState,
                    {
                        assessmentDetailId: { id: questionId },
                        choices: [choiceId],
                    },
                ];
            }
        });
    }, [selectedOptions]);

    return (
        <>
            {questions && questions.length > 0 ? (
                <div>
                    <div className=''>
                        <button
                            type='button'
                            className='border float-right border-[#15A34F] bg-[#D8FFE8] text-[15px] font-semibold text-[#15A34F] py-1.5 px-5 shadow transition-all hover:scale-[1.03] rounded-3xl'
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                    <div className='pl-4 '>
                        <CheckBoxField
                            control={control}
                            label={"English"}
                            name={"English"}
                        // value={watch("English")}
                        />
                        <CheckBoxField
                            control={control}
                            label={"Hindi"}
                            name={"Hindi"}
                        />
                        <CheckBoxField
                            control={control}
                            label={"local"}
                            name={"local"}
                        />
                    </div>

                    <div className="w-full space-y-4 px-3">
                        {questions.length > 0 &&
                            questions.map((question, qIndex) => (
                                <div
                                    key={qIndex}
                                    className="w-full"
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
                                                            className={`h-7 px-[9px] text-[12px] flex items-center mt-0.5 font-medium justify-center text-center rounded-full border-[1.5px] ${selectedOptions &&
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
                </div>
            ) : (
                <h1 className='text-center my-2 font-medium'>
                    No Assessment found
                    <span className='animate-pulse'>
                        ...
                    </span>
                </h1 >
            )}
        </>
    )
}

export default RunTimeTopicAsseement;