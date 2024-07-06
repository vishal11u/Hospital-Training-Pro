import { Box, Button, Checkbox, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { IoCloseCircleOutline, IoCloudUploadOutline, IoDocumentTextOutline } from 'react-icons/io5';
import CommonCheckbox from '../../../../../common/CommonCheckbox';

import { toast } from "sonner";
import removeIcon from '../../../../../assets/masters/remove.svg';
import RadioField from '../../../../../common/CommonRadioFeild';
import InputField from '../../../../../common/CommonInputfeild';
import CheckBoxField from '../../../../../common/CommonCheckboxFeield';

import { IoIosAddCircle } from "react-icons/io";
import DropdownField from '../../../../../common/CommonDropDown';
import { fetchEmployeeDropDown } from '../../../../../services/assigntraining/AssignTraining';
import { fetchRunTimeCourseData, saveRunTimeCourse } from '../../services/runtimecourse/RunTimeCourse';
import RunTimeCourseAssesmentQuetionCard from './RunTimeCourseAssesmentQuetionCard';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "1200px",
    maxheight: "625px",
    bgcolor: "background.paper",
    boxShadow: 24,
    px: 3,
    py: 1,
    borderRadius: 4,
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'darkgray lightgray',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
        width: '12px',
        height: "10px"
    },
    '&::-webkit-scrollbar-track': {
        background: 'lightgray',
        borderRadius: '15px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'gray',
        borderRadius: '15px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: 'darkgray',
    },
};

function RunTimeCourseCreateModal({
    runtimeCourseModalOpen,
    handleClose,
    setUploadedFiles,
    uploadedFiles,
    runTimeCourseListing,
    listId,
    editData,
    handleOpen,
    openEditModal
}) {
    // console.log("hsbbscbsc", openEditModal, listId);
    const [questionData, setQuestionData] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [questionType, setQuestionType] = useState(true);
    const [languages, setLanguages] = useState([
        { id: 1, description: "English", language: "lOne", isDefault: true },
        { id: 2, description: "Hindi", language: "lTwo", isDefault: false },
        { id: 3, description: "Local", language: "lThree", isDefault: false },
    ]);
    const [isActive, setIsActive] = useState(false);
    // const [assessmentTypeLocked, setAssessmentTypeLocked] = useState(false);
    const [employeeDropDown, setEmployeeDropDown] = useState([]);

    const defaultValues = {
        English: true,
        employees: '',
        VideoUrl: '',
        Document: '',
        assessmentType: "Pre-Assessment",
        assessmentName: '',
        questionType: "single",
        options: [{ text: '', isAnswer: false }],
        isActive: false
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
        reset,
        getValues,
        clearErrors,
        trigger,
        register,
        setError
    } = useForm({
        defaultValues
    });

    const optionLimit = 4;

    let activeLanguage = [];

    const Languages = ["English", "Hindi", "Local"];
    const watchedEnglishFields = watch(["EnglishTopicName", "EnglishVideoUrl"]);
    const watchedHindiFields = watch(["HindiTopicName", "HindiVideoUrl"]);

    const { fields, remove, append } = useFieldArray({
        control,
        name: "options",
    });

    const languageValues = useWatch({
        control,
        name: languages.map((lang) => lang.language),
    });

    const validateValues = (values) => {
        const errors = {};
        if (!values.assessmentName) {
            errors.assessmentName = "Assessment Name is required";
        }
        if (values.lOne && !values.lOneQuestion) {
            errors.lOneQuestion = "Level One Question is required";
        }
        values.lOneOptions.forEach((option, index) => {
            if (!option.option) {
                errors[`lOneOptions[${index}].option`] = `Option ${index + 1} for Level One is required`;
            }
        });
        return errors;
    };

    const onSubmitArray = useCallback(async () => {
        const values = getValues();
        const isValid = await trigger();
        const validationErrors = validateValues(values);

        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([key, message]) => {
                setError(key, { type: 'manual', message });
            });
            toast.error("Please complete all fields");
            return;
        }

        if (isValid) {
            const createAssessmentPayload = (question, options, lang) => ({
                [`question${lang}`]: question,
                answerChoices: {
                    choiceOne: options[0]?.option ?? null,
                    choiceTwo: options[1]?.option ?? null,
                    choiceThree: options[2]?.option ?? null,
                    choiceFour: options[3]?.option ?? null,
                }
            });
            const questionPayload = {
                correctChoices: answers,
                ...(values.lOneQuestion && { assessmentEnglish: createAssessmentPayload(values.lOneQuestion, values.lOneOptions, 'English') }),
                ...(values.lTwoQuestion && { assessmentHindi: createAssessmentPayload(values.lTwoQuestion, values.lTwoOptions, 'Hindi') }),
                ...(values.lThreeQuestion && { assessmentLocal: createAssessmentPayload(values.lThreeQuestion, values.lThreeOptions, 'Local') })
            };

            if (answers.length === 0) {
                toast.warning("Select at least one Answer");
                return;
            }

            setQuestionData((prevData) => [...prevData, questionPayload]);

            setValue('lOneQuestion', "");
            setValue('lOneOptions', Array(4).fill({ option: "" }));
            setValue('lTwoQuestion', "");
            setValue('lTwoOptions', Array(4).fill({ option: "" }));
            setValue('lThreeQuestion', "");
            setValue('lThreeOptions', Array(4).fill({ option: "" }));
            setValue('isActive', false)
            // reset({
            //     assessmentName: values.assessmentName,
            // });
        } else {
            toast.error("Please complete all fields");
        }
    }, [answers, getValues, setError, trigger, reset, setQuestionData]);

    const validateData = (data) => {
        const errors = {};
        if (!data.EnglishTopicName) {
            errors.EnglishTopicName = "English Topic Name is required";
        }
        if (!data.EnglishVideoUrl) {
            errors.EnglishVideoUrl = "English Video URL is required";
        }
        if (!data.employees) {
            errors.employees = "Employee Select is required";
        }
        if (data.HindiTopicName && !data.HindiVideoUrl) {
            errors.HindiVideoUrl = "Hindi Video URL is required if Hindi Topic Name is provided";
        }
        if (data.LocalTopicName && !data.LocalVideoUrl) {
            errors.LocalVideoUrl = "Local Video URL is required if Local Topic Name is provided";
        }
        return errors;
    };

    const submitSaveAssesment = useCallback(async (data) => {
        const validationErrors = validateData(data);

        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([key, message]) => {
                setError(key, { type: 'manual', message });
            });
            toast.error("Please complete all required fields");
            return;
        }

        const getTopicDetails = (topicKeyName, videoUrlKeyName, language, data, uploadedFiles) => {
            const result = {};
            result[`${topicKeyName}${language}`] = data[`${language}TopicName`] || null;
            result[`${videoUrlKeyName}${language}`] = data[`${language}VideoUrl`] || null;
            // result[`docPath${language}`] = uploadedFiles[language]?.content || null;
            return result;
        };

        const mainPayload = {
            id: openEditModal ? editData : null,
            isActive: isActive,
            createdBy: openEditModal ? null : 0,
            updatedBy: openEditModal ? 1 : null,
            assessmentType: data.assessmentType === "Pre-Assessment" ? 0 : 1,
            assessmentName: data.assessmentName,
            topicEnglish: {
                ...getTopicDetails('topicName', 'topicUrl', 'English', data, uploadedFiles),
                docPathEnglish: uploadedFiles["English"]?.content || null,
            },
            topicHindi: data.HindiTopicName ? {
                ...getTopicDetails('topicName', 'topicUrl', 'Hindi', data, uploadedFiles),
                docPathHindi: uploadedFiles["Hindi"]?.content || null,
            } : null,
            topicLocal: data.LocalTopicName ? {
                ...getTopicDetails('topicName', 'topicUrl', 'Local', data, uploadedFiles),
                docPathLocal: uploadedFiles["Local"]?.content || null,
            } : null,
            docFileNameEnglish: uploadedFiles["English"]?.name || null,
            docFileNameHindi: uploadedFiles["Hindi"]?.name || null,
            docFileNameLocal: uploadedFiles["Local"]?.name || null,
            employeesList: data?.employees,
            runTimeCourseDetailReqDto: questionData,
        };

        if (!uploadedFiles) {
            toast.warning("Please Upload Documents");
            return;
        }

        try {
            await saveRunTimeCourse(mainPayload);
            toast.success("Saved Successfully");
            reset();
            handleClose();
            runTimeCourseListing();
        } catch (error) {
            // toast.error(error.message || "An error occurred");
            console.log(error);
        }
    }, [isActive, uploadedFiles, questionData, saveRunTimeCourse, handleClose, runTimeCourseListing, setError]);

    const handleRemoveQuestion = (index) => {
        setQuestionData((prev) => prev.filter((_, i) => i !== index));
    };

    const removeChoice = useCallback(
        (index) => {
            remove(index);
            activeLanguage.forEach((lang) => {
                clearErrors(`${lang}Options.${index}.option`);
            });
            const updatedValues = { ...getValues() };
            activeLanguage.forEach((lang) => {
                if (updatedValues[`${lang}Options`]) {
                    updatedValues[`${lang}Options`].splice(index, 1);
                }
            });
            reset(updatedValues, { errors: true });
        },
        [remove, reset, clearErrors, getValues, activeLanguage]
    );

    const handleOptionChange = useCallback(
        (index, isChecked) => {
            const id = index + 1;
            setAnswers((prevAnswers) => {
                if (questionType) {
                    return isChecked ? [id] : [];
                } else {
                    if (isChecked) {
                        return [...prevAnswers, id];
                    } else {
                        return prevAnswers.filter((answerId) => answerId !== id);
                    }
                }
            });
        },
        [questionType]
    );

    const addChoice = () => {
        const lastIndex = fields.length - 1;
        const lastChoiceFilled = selectedLanguages.every((lang) => {
            if (lang.value) {
                const lastChoiceValue = getValues(
                    `${lang.language}Options.${lastIndex}.option`
                );
                return lastChoiceValue && lastChoiceValue.trim() !== "";
            }
            return true;
        });

        if (lastChoiceFilled) {
            append({ option: "", isAnswer: false });
        } else {
            toast("Please Fill First Field", {
                description: "Then Next Fields are Created",
            });
        }
    };

    const questionsTypes = watch("questionType");

    const onCheckboxChange = (language, checked) => {
        setValue(language, checked);
    };

    const watchedCheckboxes = watch(
        languages.reduce((acc, lang) => ({ ...acc, [lang]: false }), {})
    );

    const onFileUpload = (event, language) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedFiles((prevState) => ({
                    ...prevState,
                    [language]: { name: file.name, content: reader.result.split(",")[1] },
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchData = async (i) => {
            try {
                const res = await fetchRunTimeCourseData(listId);
                const module = res.result[0];

                handleOpen();
                reset();
                const formattedResult = {
                    ...module,
                    topicEnglish: JSON.parse(module?.topicEnglish),
                    topicHindi: JSON.parse(module?.topicHindi),
                    topicLocal: JSON.parse(module?.topicLocal),
                };

                Languages.forEach((language) => {
                    const topicKey = `topic${language}`;
                    if (formattedResult[topicKey]) {
                        setValue(language, true);
                        setValue(
                            `${language}TopicName`,
                            formattedResult[topicKey][`topicName${language}`]
                        );
                        setValue(
                            `${language}VideoUrl`,
                            formattedResult[topicKey][`topicUrl${language}`]
                        );
                        const docFileNameKey = `docFileName${language}`;
                        const docPathKey = `docPath${language}`;
                        console.log("bvbduvu", docPathKey);
                        if (formattedResult[docFileNameKey]) {
                            setUploadedFiles((prevState) => ({
                                ...prevState,
                                [language]: {
                                    name: formattedResult[docFileNameKey],
                                    content: formattedResult[docPathKey],
                                },
                            }));
                        }
                    }
                });

                setValue("assessmentName", module.assessmentName);
                setValue("assessmentType", module.assessmentType);
                setIsActive(module.status);
                const assessmentDetails = JSON.parse(module.assessmentDetail);
                const parsedAssessmentDetails = assessmentDetails.map((detail) =>
                    JSON.parse(detail)
                );
                setQuestionData(parsedAssessmentDetails);

                const parseEmployeeData = JSON.parse(module.employees);
                const parsedEmployeeDetails = parseEmployeeData.map((employee) => JSON.parse(employee));
                const employeeDropDownDetails = parsedEmployeeDetails.map((list) => ({
                    id: list?.empId,
                    label: list?.empName,
                    value: list?.empName
                }))
                setValue("employees", employeeDropDownDetails)
            } catch (error) {
                console.error("Error fetching runtime course data:", error);
                // toast.error(error.message);
            }
        };

        if (openEditModal && editData !== null) {
            fetchData();
        }
    }, [openEditModal, listId]);

    useEffect(() => {
        setQuestionType(questionsTypes === "single");
        setAnswers([]);
    }, [questionsTypes]);

    useEffect(() => {
        const newSelectedLanguages = languages.map((language, index) => ({
            value: language.isDefault ? true : languageValues[index],
            description: language.description,
            language: language.language,
            id: language.id,
        }));
        setSelectedLanguages(newSelectedLanguages);
    }, [languageValues, languages]);


    useEffect(() => {
        // if (!openEditModal) {
        fetchEmployeeDropDown()
            .then((res) => {
                setEmployeeDropDown(res.result);
            })
            .catch((err) => {
                console.log(err);
            });
        // }
    }, []);

    return (
        <>
            <Modal
                open={runtimeCourseModalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h8"
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                        component="h2"
                    >
                        <h1 className="text-[20px] font-semibold">
                            Add New
                        </h1>
                        <IconButton onClick={handleClose}>
                            <IoCloseCircleOutline color="red" />
                        </IconButton>
                    </Typography>
                    <hr className="bg-black mb-1" />
                    <form className='' onSubmit={handleSubmit(submitSaveAssesment)}>
                        <h1 className='font-semibold text-[16px]'>
                            Topic :
                        </h1>
                        <div className=''>
                            <div className="flex flex-row space-x-4 -mt-1">
                                {Languages?.length > 0 &&
                                    Languages.map((language) => (
                                        <CheckBoxField
                                            control={control}
                                            name={language}
                                            label={language}
                                            // value={language}
                                            // defaultValue={language}
                                            onChange={(e) => onCheckboxChange(language, e.target.checked)}
                                            disabled={
                                                (language === "Hindi" &&
                                                    (!watchedEnglishFields[0] ||
                                                        !watchedEnglishFields[1])) ||
                                                (language === "Local" &&
                                                    (!watchedHindiFields[0] ||
                                                        !watchedHindiFields[1]))
                                            }
                                        />
                                    ))}
                            </div>
                            <div className='-mt-2'>
                                {Languages?.length > 0 &&
                                    Languages.map(
                                        (language) =>
                                            watchedCheckboxes[language] && (
                                                <div
                                                    key={language}
                                                    className="flex flex-row items-center space-x-4 my-2 w-full"
                                                >
                                                    <InputField
                                                        sx={{ width: 355 }}
                                                        label={`${language} Topic Name`}
                                                        name={`${language}TopicName`}
                                                        control={control}
                                                        error={errors[`${language}TopicName`]}
                                                    />
                                                    <InputField
                                                        sx={{ width: 355 }}
                                                        label={`${language} Video URL`}
                                                        name={`${language}VideoUrl`}
                                                        control={control}
                                                        error={errors[`${language}VideoUrl`]}
                                                    />
                                                    <div className="flex items-center ">
                                                        <input
                                                            accept=".pdf,.txt"
                                                            id={`upload-${language}`}
                                                            type="file"
                                                            style={{ display: "none" }}
                                                            onChange={(e) => onFileUpload(e, language)}
                                                            className=""
                                                        />
                                                        <label htmlFor={`upload-${language}`}>
                                                            <Button
                                                                type="button"
                                                                variant="outlined"
                                                                color="primary"
                                                                sx={{
                                                                    py: 0.7,
                                                                    mr: 0.2,
                                                                    fontSize: "13px",
                                                                    gap: "5px",
                                                                    borderRadius: "8px",
                                                                }}
                                                                component="span"
                                                            >
                                                                <IoCloudUploadOutline size={19} /> upload
                                                                Document
                                                            </Button>
                                                        </label>
                                                        {uploadedFiles && uploadedFiles[language] && (
                                                            <Typography
                                                                variant="body2"
                                                                className=" flex items-center space-x-1 text-gray-600"
                                                            >
                                                                <IoDocumentTextOutline size={15} />
                                                                {uploadedFiles[language]?.name}
                                                            </Typography>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                    )}
                            </div>
                        </div>
                        {/* ---------- Assesment section ----------- */}
                        <h1 className='font-semibold text-[16px] -mt-1.5'>
                            Assesment :
                        </h1>
                        <div className='flex gap-x-3 pt-1.5 -mt-1'>
                            <div className='w-full lg:w-[65%] max-h-[57vh]' style={{ scrollbarWidth: 'thin' }}>
                                <div className=' '>
                                    <div className='border border-[#CCCCCC] rounded-md shadow px-3 pt-2'>
                                        <div className='flex flex-col lg:flex-row items-center justify-between mt-1'>
                                            <div className=''>
                                                <InputField
                                                    sx={{ width: 390 }}
                                                    label={'Assessment Name'}
                                                    control={control}
                                                    name={'assessmentName'}
                                                    error={errors?.assessmentName}
                                                />
                                            </div>
                                            <RadioField
                                                dataArray={[
                                                    { id: 'Pre-Assessment', value: 'Pre-Assessment', label: 'Pre-Assessment' },
                                                    { id: 'Post-Assessment', value: 'Post-Assessment', label: 'Post-Assessment' },
                                                ]}
                                                control={control}
                                                name={'assessmentType'}
                                                error={errors?.assessmentType}
                                            />
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <div className=''>
                                                {languages?.map((language) => (
                                                    <CheckBoxField control={control} name={language?.language} defaultValue={language?.isDefault} label={language?.description} />
                                                ))}
                                            </div>
                                            <div className=''>
                                                <CommonCheckbox
                                                    label={"Active"}
                                                    checked={isActive}
                                                    onChange={(e) => setIsActive(e.target.checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='h-[32.5vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500'>
                                        <div className='grid grid-cols-1 gap-2 mt-1'>
                                            <div className='grid grid-cols-1 gap-y-2 px-2 shadow border border-[#CCCCCC] p-3 rounded-md'>
                                                <div className=''>
                                                    <p className='font-semibold'>Assessment Question</p>
                                                    <div className='block gap-y-2 -mt-2'>
                                                        {selectedLanguages?.map((ele, index) => (
                                                            ele.value && (
                                                                <div className='mt-4' key={index}>
                                                                    <InputField
                                                                        name={`${ele?.language}Question`}
                                                                        control={control}
                                                                        label={`Question (${ele?.description.charAt(0).toUpperCase() + ele?.description.slice(1)})`}
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        InputLabelProps={{
                                                                            shrink: `${ele?.language}Question` !== "" ? true : false
                                                                        }}
                                                                        error={errors?.[`${ele?.language}Question`]}
                                                                    />
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className='font-semibold text-[14px]'>Choices*</p>
                                                    <div className='grid grid-cols-1 gap-y-2 mt-1'>
                                                        {fields.map((item, index) => (
                                                            <div key={item.id} className=''>
                                                                <div className='flex gap-x-2 items-center'>
                                                                    <div className='flex gap-x-2 gap-y-2 w-full'>
                                                                        {selectedLanguages.map(lang => (
                                                                            lang?.value && (
                                                                                <div className='mt-2' key={lang.language}>
                                                                                    <InputField
                                                                                        name={`${lang?.language}Options.${index}.option`}
                                                                                        control={control}
                                                                                        label={`${lang?.description.charAt(0).toUpperCase() + lang?.description.slice(1)} Option ${index + 1}`}
                                                                                        variant="outlined"
                                                                                        fullWidth
                                                                                        InputLabelProps={{
                                                                                            shrink: `${lang?.language}Options.${index}.option` !== "" ? true : false
                                                                                        }}
                                                                                        error={errors && errors[`${lang?.language}Options`] && errors[`${lang?.language}Options`][index] && errors[`${lang?.language}Options`][index].option}
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        ))}
                                                                    </div>
                                                                    <div className='flex items-center w-[15%]'>
                                                                        <Tooltip title='is Answer' arrow placement='left'>
                                                                            <Checkbox
                                                                                size="small"
                                                                                {...register(`options.${index}.isAnswer`)}
                                                                                checked={answers && answers.includes(index + 1)}
                                                                                onChange={(e) => {
                                                                                    handleOptionChange(index, e.target.checked);
                                                                                }}
                                                                            />
                                                                        </Tooltip>
                                                                        {fields.length > 1 && (
                                                                            <button
                                                                                className='rounded-md text-[12px] text-red-500'
                                                                                type='button'
                                                                                onClick={() => removeChoice(index)}
                                                                            >
                                                                                <img className='w-[24px]' src={removeIcon} alt='remove' />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {fields.length < optionLimit && index === fields.length - 1 && (
                                                                    <button
                                                                        className='rounded-md text-[14px] font-semibold mt-2'
                                                                        type='button'
                                                                        onClick={addChoice}
                                                                    >
                                                                        + Add Choices
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button className='bg-blue-500 float-right -mt-0 text-white rounded-md font-medium shadow-md px-2 py-1 text-[13px] gap-x-0.5 flex items-center justify-center transition-all hover:bg-gray-600' type='button' onClick={onSubmitArray}>
                                                        <IoIosAddCircle size={17} />
                                                        <p className='pr-0.5 pt-0.5'>
                                                            Add
                                                        </p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full lg:w-[35%] ' style={{ scrollbarWidth: 'thin' }}>
                                <RunTimeCourseAssesmentQuetionCard
                                    questionData={questionData}
                                    setQuestionData={setQuestionData}
                                    handleRemoveQuestion={handleRemoveQuestion}
                                />
                            </div>
                        </div>
                        {/* ----------------- employees data ---------------- */}
                        <h1 className='font-semibold text-[16px] my-1.5'>
                            Select Employees :
                        </h1>
                        <div className="w-[35%]">
                            <DropdownField
                                name="employees"
                                isClearable={true}
                                isSearchable={true}
                                isMulti={true}
                                control={control}
                                dataArray={employeeDropDown}
                                error={errors.employees}
                                placeholder={"Select Employee"}
                                defaultValue={defaultValues.employees}
                            />
                        </div>
                        <div className='flex items-center justify-end space-x-4 pb-1'>
                            <Button variant='outlined' color='error' type='button' onClick={() => reset()}>
                                Reset
                            </Button>
                            <Button type='submit' variant='contained' color='success'>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    )
}

export default RunTimeCourseCreateModal;