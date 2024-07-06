import React, { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { InputAdornment, TextField } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IoSearch } from "react-icons/io5";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "sonner";
import CommonTable from "../../../../../common/CommonTable";
import {
  deleteAssessment,
  fetchAllAssesList,
  fetchAssesmentDataEdit,
} from "../../services/assessmentmaster/AssessmentMaster";
import { RiEdit2Line } from "react-icons/ri";
import { API_BASE_URL } from "../../../../../http_Common";
import axios from "axios";
import CommonLaader from "../../../../../common/CommonLoader";
import Assesment_Modal from "./AssesmentModal";

function AssesmentMasterMainPage() {
  const [questionData, setQuestionData] = useState([]);
  const [open, setOpen] = useState(false);
  const [assName, setAssName] = useState("");
  const [assessmentType, setAssessmentType] = useState("Pre-Assessment");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [questionType, setQuestionType] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [languages, setLanguages] = useState([
    { id: 1, description: "English", language: "lOne", isDefault: true },
    { id: 2, description: "Hindi", language: "lTwo", isDefault: false },
    { id: 3, description: "Local", language: "lThree", isDefault: false },
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searching, setSearching] = useState("");
  const [listing, setListing] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assessmentTypeLocked, setAssessmentTypeLocked] = useState(false);

  const optionLimit = 4;

  const createQuestionValidationSchema = (activeLanguages) => {
    let schemaFields = {};
    activeLanguages.forEach((language) => {
      schemaFields[`${language}Question`] = Yup.string().required();
    });
    return Yup.object().shape(schemaFields);
  };

  const createOptionValidationSchema = (activeLanguage, optionLimit) => {
    const optionSchema = Yup.object().shape({
      option: Yup.string().required("Option is required"),
    });

    const languageSchemas = activeLanguage.reduce((acc, lang) => {
      acc[`${lang}Options`] = Yup.array()
        .of(optionSchema)
        .max(optionLimit, `You can only add up to ${optionLimit} options`);
      return acc;
    }, {});

    return Yup.object().shape({
      ...languageSchemas,
      options: Yup.array()
        .of(Yup.object().shape({ isAnswer: Yup.boolean() }))
        .max(optionLimit, `You can only add up to ${optionLimit} choices`),
    });
  };

  const assessmentSchema = Yup.object({
    assessmentType: Yup.string().required(),
    questionType: Yup.string().required(),
    assessmentName: Yup.string().required(),
  }).required();

  let activeLanguage = [];
  const combinedValidationSchema = (selectedLanguages, optionLimit) => {
    selectedLanguages?.forEach((lang) => {
      if (lang?.value) {
        activeLanguage.push(lang?.language);
      }
    });
    const questionSchema = createQuestionValidationSchema(activeLanguage);
    const optionSchema = createOptionValidationSchema(
      activeLanguage,
      optionLimit
    );
    return assessmentSchema.concat(questionSchema).concat(optionSchema);
  };

  const validationSchema = combinedValidationSchema(
    selectedLanguages,
    optionLimit
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    clearErrors,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      assessmentType: assessmentType,
      assessmentName: "",
      questionType: "single",
      options: [{ text: "", isAnswer: false }],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "options",
  });

  const languageValues = useWatch({
    control,
    name: languages.map((lang) => lang.language),
  });

  const showAllTopicList = () => {
    setLoading(true);
    fetchAllAssesList(searching, page, rowsPerPage)
      .then((res) => {
        setListing(res.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topic list:", error);
        setLoading(false);
      });
  };

  const onSubmitArray = useCallback(
    (data) => {
      if (answers.length === 0) {
        toast.warning("Select at least one Answer");
        return;
      }

      setAssName(data.assessmentName);
      // setAnswers({
      //     answerChoices: {
      //         choiceOne: data.lThreeOptions[0]?.option ?? null,
      //         choiceTwo: data.lThreeOptions[1]?.option ?? null,
      //         choiceThree: data.lThreeOptions[2]?.option ?? null,
      //         choiceFour: data.lThreeOptions[3]?.option ?? null
      //     }
      // })

      const questionPayload = {
        answerType: data.questionType === "single" ? 0 : 1,
        correctChoices: answers,
      };

      if (data.lOneQuestion) {
        questionPayload.assessmentEnglish = {
          questionEnglish: data.lOneQuestion,
          answerChoices: {
            choiceOne: data.lOneOptions[0]?.option ?? null,
            choiceTwo: data.lOneOptions[1]?.option ?? null,
            choiceThree: data.lOneOptions[2]?.option ?? null,
            choiceFour: data.lOneOptions[3]?.option ?? null,
          },
        };
      }

      if (data.lTwoQuestion) {
        questionPayload.assessmentHindi = {
          questionHindi: data.lTwoQuestion,
          answerChoices: {
            choiceOne: data.lTwoOptions[0]?.option ?? null,
            choiceTwo: data.lTwoOptions[1]?.option ?? null,
            choiceThree: data.lTwoOptions[2]?.option ?? null,
            choiceFour: data.lTwoOptions[3]?.option ?? null,
          },
        };
      }

      if (data.lThreeQuestion) {
        questionPayload.assessmentLocal = {
          questionLocal: data.lThreeQuestion,
          answerChoices: {
            choiceOne: data.lThreeOptions[0]?.option ?? null,
            choiceTwo: data.lThreeOptions[1]?.option ?? null,
            choiceThree: data.lThreeOptions[2]?.option ?? null,
            choiceFour: data.lThreeOptions[3]?.option ?? null,
          },
        };
      }

      setQuestionData((prevData) => [...prevData, questionPayload]);
      reset({
        assessmentName: data.assessmentName,
        lOneQuestion: "",
        lOneOptions: [
          { option: "" },
          { option: "" },
          { option: "" },
          { option: "" },
        ],
        lTwoQuestion: "",
        lTwoOptions: [
          { option: "" },
          { option: "" },
          { option: "" },
          { option: "" },
        ],
        lThreeQuestion: "",
        lThreeOptions: [
          { option: "" },
          { option: "" },
          { option: "" },
          { option: "" },
        ],
      });
      // reset({
      //     ...getValues(),
      //     // options: [{ option: '', isAnswer: false }]
      // });
    },
    [answers, reset, getValues]
  );

  const submitSaveAssesment = async () => {
    const mainPayload = {
      id: editingIndex ? null : 0,
      assessmentType: assessmentType === "Pre-Assessment" ? 0 : 1,
      assessmentName: assName,
      isActive: isActive,
      createdBy: editingIndex ? 1 : null,
      updatedBy: editingIndex ? null : 2,
      assessmentDetailReqDto: questionData,
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/coursesMaster/saveAssessment`,
        mainPayload
      );
      console.log("Response:", res);
      showAllTopicList();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsActive(false);
    setAssessmentTypeLocked(false);
    reset();
    setQuestionData([]);
    setAnswers([]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestionData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpen = () => {
    setOpen(true);
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

  const renderAction = (row, index) => {
    return (
      <div className="flex items-center space-x-2 ml-1">
        <button
          type="button"
          className="text-blue-500"
          onClick={() => handleEdit(index)}
        >
          <RiEdit2Line size={20} />
        </button>
        <button
          type="button"
          className="text-red-500"
          onClick={() => handleDelete(index)}
        >
          <MdDeleteOutline size={20} />
        </button>
      </div>
    );
  };

  const renderInput = useCallback((row, index, header) => {
    return (
      <div className="py-1 font-medium">
        {header === "Status" && (
          <p
            className={`w-[90%] -ml-2.5 font-medium ${row.Status === false
              ? "text-[#EF4712] text-center py-1 bg-[#EF12121A] rounded"
              : "text-[#3FC28A] py-1 text-center bg-[#3FC28A1A] rounded"
              }`}
          >
            {row[header] === true ? "Active" : "Inactive"}
          </p>
        )}
        {header === "Created Date" && <p className="pl-1.5">{row[header]}</p>}
        {header === "Created By" && <p className="pl-1.5">{row[header]}</p>}
        {header === "Sr. No." && <p className="pl-5">{row[header]}</p>}
        {header === "Topic Name" && <p className="pl-2">{row[header]}</p>}
        {header === "Last Modified By" && (
          <p className="pl-1.5">{row[header]}</p>
        )}
        {header === "Last Modified Date" && (
          <p className="pl-1">{row[header]}</p>
        )}
        {header === "Assessment Name" && (
          <p className="pl-2.5">{row[header]}</p>
        )}
        {header === "Assessment Type" && (
          <p className="pl-2.5">{row[header]}</p>
        )}
      </div>
    );
  }, []);

  const questionsTypes = watch("questionType");

  const handleAssessmentTypeChange = (event) => {
    if (!assessmentTypeLocked) {
      setAssessmentType(event.target.value);
    }
  };

  const handleEdit = async (index) => {
    setEditingIndex(true);
    try {
      const topicData = listing[index];
      const id = topicData.Id;
      const res = await fetchAssesmentDataEdit(id);
      const topic = res.result[0];
      const assessmentDetails = JSON.parse(topic.assessmentDetail);
      const parsedAssessmentDetails = assessmentDetails.map((detail) =>
        JSON.parse(detail)
      );

      setValue("assessmentName", topic.assessmentName);
      setAssessmentType(
        topic.assessmentType === "single" ? "Pre-Assessment" : "Post-Assessment"
      );
      setIsActive(topic.isActive);

      setQuestionData(parsedAssessmentDetails);
      console.log("SelectedQuestion", parsedAssessmentDetails);
      handleOpen();
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
      toast(error.message);
    }
  };

  const handleEditQuestion = useCallback(
    (index) => {
      const selectedQuestion = questionData[index];
      console.log("SelectedQuestion:", selectedQuestion);
      setSelectedQuestion(selectedQuestion);
      setEditingIndex(index);
      setValue(
        "questionType",
        selectedQuestion?.answerType === 0 ? "single" : "multiple"
      );
      // setValue('assessmentName', assName);
      const correctChoices = selectedQuestion?.correctChoices || [];
      setAnswers(correctChoices);
      console.log("correctChoices", correctChoices);
    },
    [questionData, setValue, assName]
  );

  const handleDelete = async (index) => {
    const topicData = listing[index];
    const id = topicData.Id;
    try {
      await deleteAssessment(id);
      showAllTopicList();
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

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
    showAllTopicList();
  }, [searching]);

  return (
    <div className="">
      <div className="text-center">
        <h2 className="text-[20px] font-semibold">Assessment</h2>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="w-[25%]">
          <TextField
            variant="outlined"
            label="Search Assessment Name"
            size="small"
            placeholder="Search Assessment Name"
            sx={{
              width: 320,
              "& .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IoSearch size={19} color="" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <button
          type="button"
          className="bg-[#073763] flex items-center gap-x-1 text-[14px] p-2 text-white rounded-md shadow transition-all hover:bg-gray-600"
          onClick={handleOpen}
        >
          <AddCircleOutlineIcon fontSize="small" />
          Add New Assessment
        </button>
      </div>
      <div className="mt-8">
        {loading ? (
          <CommonLaader />
        ) : (
          <div className={`${listing.length > 0 ? "mt-6" : "mt-14"}`}>
            {listing && listing.length > 0 ? (
              <CommonTable
                dataResult={listing}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                tableClass="h-80"
                count={listing.length}
                page={page}
                populateTable={() => { }}
                setRowsPerPage={setRowsPerPage}
                editableColumns={[
                  "Status",
                  "Assessment Type",
                  "Assessment Name",
                  "Created Date",
                  "Created By",
                  "Sr. No.",
                  "Topic Name",
                  "Last Modified By",
                  "Last Modified Date",
                ]}
                removeHeaders={["Id"]}
                renderActions={renderAction}
                renderInput={renderInput}
              />
            ) : (
              <p className="text-center font-semibold text-[18px] w-full">
                No Record Found...
              </p>
            )}
          </div>
        )}
      </div>
      {open && (
        <Assesment_Modal
          open={open}
          handleClose={handleClose}
          control={control}
          errors={errors}
          handleAssessmentTypeChange={handleAssessmentTypeChange}
          languages={languages}
          isActive={isActive}
          setIsActive={setIsActive}
          handleSubmit={handleSubmit}
          onSubmitArray={onSubmitArray}
          selectedLanguages={selectedLanguages}
          fields={fields}
          register={register}
          answers={answers}
          handleOptionChange={handleOptionChange}
          removeChoice={removeChoice}
          optionLimit={optionLimit}
          addChoice={addChoice}
          questionData={questionData}
          setQuestionData={setQuestionData}
          handleEditQuestion={handleEditQuestion}
          handleRemoveQuestion={handleRemoveQuestion}
          submitSaveAssesment={submitSaveAssesment}
        />
      )}
    </div>
  );
}

export default React.memo(AssesmentMasterMainPage);
