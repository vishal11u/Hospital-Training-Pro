import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { IoNewspaperOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import TainingVideosModule from "../trainingmodule/TainingVideosModule";
import TrainingVideos from "../trainingmodule/tainingmoduledocument/TrainingVideos";
import PreLeftModel from "./PreLeftModel";
import TestCompletedMessage from "./TestCompletedMessage";

import {
  fetchAllModules,
  getPreAssesmentList,
  saveCoursePreAssessment,
} from "../../services/assigncourse/CourseAssign";

function PreAssesmentTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { course } = location.state || {};
  const isCoursePreAss = course?.isCoursePreAss;
  const AssignTrainingId = course?.assignTrainingId;
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [language, setLanguage] = useState("english");
  const [videoStatus, setVideoStatus] = useState(null);
  const [preAssesmentList, setPreAssesmentList] = useState([]);
  const [defaultVideoUrl, setDefaultVideoUrl] = useState("");
  const [modules, setModules] = useState([]);

  console.log("selectedOptions", selectedOptions);
  const handleOptionSelect = (questionId, optionIndex, question) => {
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
  };
  console.log("preAssesmentList", preAssesmentList);

  const handleSubmit = useCallback(async () => {
    const unansweredQuestions = preAssesmentList.filter(
      (question) => selectedOptions[question.id] == null
    );

    const answeredCount = preAssesmentList.length - unansweredQuestions.length;
    if (unansweredQuestions.length > 0) {
      setLoading(true);
      setIsModelOpen(true);

      const payload = {
        employeeId: { id: 3 },
        assignTrainingId: modules?.assignTrainingId
          ? { id: modules.assignTrainingId }
          : null,
        courseId: modules?.modules.length > 0 ? { id: modules.courseId } : null,
        preAssessmentId: { id: videoStatus.modulePreAssId },
        assessmentDetails: selectedOptions,
        moduleId: { id: videoStatus.moduleid },
        flag: 1,
        isPreAss:
          videoStatus.isModulePreAss && videoStatus.modulePreAssId !== null
            ? true
            : false,
        isPostAss:
          videoStatus.isModulePostAss && videoStatus.modulePostAssId !== null
            ? true
            : false,
      };

      // isModulePostAss: false;
      // isModulePreAss: true;
      // moduleName: "Nurse Module Onee";
      // modulePostAssId: null;
      // modulePostAssName: null;
      // modulePreAssId: 35;
      // modulePreAssName: "Assessment Nurse One";
      // moduleid: 51;
      // status: "In-Progress";
      console.log("Payload:", payload);

      saveCoursePreAssessment(payload)
        .then((res) => {
          if (res.statusCode === 200) {
            toast.success("Test submitted.");
            setIsModelOpen(false);
            setLoading(false);
            setIsTestComplete(true);
            navigate("videos");
            setSelectedOptions(null);
            setVideoStatus(null);
            setPreAssesmentList([]);
          }
        })
        .catch((error) => {
          toast.error(error.message);
          setIsModelOpen(false);
          setLoading(false);
        });
    } else {
      toast.warning(
        `You have answered ${answeredCount} out of ${preAssesmentList.length} questions. Please answer all questions before submitting.`
      );
    }
  }, [selectedOptions, selectedOptions, navigate, modules, AssignTrainingId]);

  const handleCloseModal = () => {
    setIsModelOpen(false);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    fetchAllModules(AssignTrainingId)
      .then((res) => {
        const parsedData = JSON.parse(res.result);
        console.log("parsedData", parsedData);
        setModules(parsedData);
        if (parsedData.length > 0 && parsedData[0].modules.topics.length > 0) {
          setDefaultVideoUrl(parsedData[0].modules.topics[0].topicUrlEnglish);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [AssignTrainingId]);

  useEffect(() => {
    if (videoStatus !== null) {
      if (videoStatus.modulePreAssId !== null && videoStatus.isModulePreAss) {
        getPreAssesmentList(
          modules.assignTrainingId,
          videoStatus.modulePreAssId
        ).then((response) => {
          if (response.statusCode === 200) {
            setPreAssesmentList(JSON.parse(response.result));
          }
        });
      }
    }
  }, [videoStatus, modules]);
  console.log("videoStatus", videoStatus);
  return (
    <div className="bg-white">
      <div>
        <h1 className="text-[20px] font-semibold">{course?.courseName}</h1>
      </div>
      <div className="flex justify-between mt-3 gap-x-5">
        <div className="shadow-md rounded-md border h-[79vh] w-[67%] overflow-hidden scrollbar-corner-rounded-[100%] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-[#F18524] scrollbar-track-[#f184243a] overflow-y-scroll">
          <div>
            {videoStatus !== null &&
              videoStatus?.isModulePreAss &&
              videoStatus?.modulePreAssId !== null ? (
              <PreLeftModel
                selectedOptions={selectedOptions}
                handleSubmit={handleSubmit}
                handleOptionSelect={handleOptionSelect}
                language={language}
                handleLanguageChange={handleLanguageChange}
                preAssesmentList={preAssesmentList}
              />
            ) : (
              <TrainingVideos video={{ id: { link: defaultVideoUrl } }} />
            )}
          </div>
        </div>
        <div className="flex flex-col w-[32%]">
          <div className="border shadow-md rounded-md h-[79vh] w-full overflow-hidden scrollbar-corner-rounded-[100%] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-[#F18524] scrollbar-track-[#f184243a] overflow-y-auto py-4">
            {isCoursePreAss ? (
              isTestComplete ? (
                <>
                  {loading ? (
                    <div className="flex items-center font-semibold text-[15px] justify-center">
                      Loading...
                    </div>
                  ) : (
                    <TainingVideosModule
                      modules={modules}
                      setDefaultVideoUrl={setDefaultVideoUrl}
                      setVideoStatus={setVideoStatus}
                    />
                  )}
                </>
              ) : (
                <div className="mt-10 text-center">
                  <h1 className="text-[20px] font-semibold flex items-center gap-x-2 justify-center">
                    <IoNewspaperOutline />
                    Pre Assessment Test
                  </h1>
                  <p className="text-[14px] text-gray-600 font-medium pt-1">
                    After completing the Test, then <br /> Video and Document
                    modules will be enabled.
                  </p>
                </div>
              )
            ) : (
              <TainingVideosModule
                modules={modules}
                setDefaultVideoUrl={setDefaultVideoUrl}
                setVideoStatus={setVideoStatus}
              />
            )}
          </div>
        </div>
      </div>
      {isModelOpen && (
        <TestCompletedMessage
          isModelOpen={isModelOpen}
          onClose={handleCloseModal}
          imageSrc="https://img.freepik.com/free-vector/all-right-emoji-illustration_23-2151298395.jpg?t=st=1717419196~exp=1717422796~hmac=8039b96c51e15c39cbac692368179bccbe24b3eb114f39f3ea6a5b6125e4f372&w=740"
          message="Congratulations! You have successfully completed the test."
        />
      )}
    </div>
  );
}

export default React.memo(PreAssesmentTest);
