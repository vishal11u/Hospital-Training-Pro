import React from 'react'
import QuestionCards from './QuestionCards';
import { Box, Checkbox, IconButton, InputAdornment, Modal, TextField, Tooltip, Typography } from '@mui/material';
import { MdDeleteOutline, MdOutlineNavigateNext } from "react-icons/md";
import removeIcon from '../../../../../assets/masters/remove.svg';
import RadioField from '../../../../../common/CommonRadioFeild';
import InputField from '../../../../../common/CommonInputfeild';
import CheckBoxField from '../../../../../common/CommonCheckboxFeield';
import { IoCloseCircleOutline, IoSearch } from 'react-icons/io5';
import CommonCheckbox from '../../../../../common/CommonCheckbox';

function Assesment_Modal({
    open,
    handleClose,
    control,
    errors,
    handleAssessmentTypeChange,
    languages,
    isActive,
    setIsActive,
    handleSubmit,
    onSubmitArray,
    selectedLanguages,
    fields,
    register,
    answers,
    handleOptionChange,
    removeChoice,
    optionLimit,
    addChoice,
    questionData,
    setQuestionData,
    handleEditQuestion,
    handleRemoveQuestion,
    submitSaveAssesment
}) {
    return (
        <>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    variant="outlined"
                    sx={{
                        width: 1300,
                        borderRadius: 5,
                        p: 3,
                        boxShadow: 'lg',
                        backgroundColor: 'white'
                    }}
                >
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        sx={{ mt: -1, borderBottom: '1px solid #a9a9a9', display: 'flex', alignItems: 'center', justifyContent: "space-between" }}
                        pb={0.5}
                    >
                        <h1 className='text-[20px] font-semibold'>Add New Assessment</h1>
                        <IconButton onClick={handleClose}>
                            <IoCloseCircleOutline color='red' />
                        </IconButton>
                    </Typography>
                    <Typography id="modal-desc" textColor="text.tertiary">
                        <div className='flex gap-x-3 mt-3'>
                            <div className='w-full lg:w-[65%] overflow-y-auto max-h-[58vh]' style={{ scrollbarWidth: 'thin' }}>
                                <div className=' h-[100%]'>
                                    <div className='border border-[#CCCCCC] rounded-md shadow p-3'>
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
                                                onChange={handleAssessmentTypeChange}
                                            // disabled={assessmentTypeLocked}
                                            />
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <div className='pt-1 -mb-1.5'>
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

                                    <form onSubmit={handleSubmit(onSubmitArray)}>
                                        <div className='grid grid-cols-1 gap-2 mt-2'>
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
                                                    <div className='flex gap-x-4 items-center mt-2'>
                                                        <p className='text-[15px] font-semibold'>Answer Type : </p>
                                                        <div className='mt-1.5'>
                                                            <RadioField
                                                                defaultValue={'radio'}
                                                                control={control}
                                                                name={'questionType'}
                                                                dataArray={[
                                                                    { id: 'single', value: 'single', label: 'Radio' },
                                                                    { id: 'multiple', value: 'multiple', label: 'CheckBox' },
                                                                ]}
                                                                error={errors?.questionType}
                                                            />
                                                        </div>
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
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex justify-end gap-x-2 mt-4'>
                                            <button className='bg-blue-500 text-white rounded-lg font-medium shadow-md px-4 py-1.5 text-[15px] flex items-center transition-all hover:bg-gray-600' type='submit'>
                                                Add <MdOutlineNavigateNext size={23} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className='w-full lg:w-[35%] overflow-y-auto max-h-[80vh] custom-scrollbar' style={{ scrollbarWidth: 'thin' }}>
                                <QuestionCards
                                    questionData={questionData}
                                    setQuestionData={setQuestionData}
                                    handleEditQuestion={handleEditQuestion}
                                    handleRemoveQuestion={handleRemoveQuestion}
                                    saveAssessment={submitSaveAssesment}
                                />
                            </div>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default React.memo(Assesment_Modal);