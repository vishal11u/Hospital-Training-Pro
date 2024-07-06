import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MdArrowRight, MdArrowDropDown } from "react-icons/md";
import QuizIcon from "../assets/assesment_items/Quiz_tour.svg";
import Line from "../assets/modules/line.svg";
import EndLine from "../assets/modules/Straightline.svg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import axios from "axios";
import { useLocation } from "react-router-dom";
import { getModuleStartAndEndTime } from "../services/assigncourse/CourseAssign";

function CustomAccordion({ modules, setDefaultVideoUrl, setVideoStatus }) {
  const [expanded1, setExpanded1] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [completedModules, setCompletedModules] = useState([]);

  const location = useLocation();

  const handleChangeExpanded1 = (
    panel,
    event,
    isExpanded,
    moduleId,
    itemList
  ) => {
    setExpanded1((prev) => ({
      ...prev,
      [panel]: isExpanded ? panel : false,
    }));
    setVideoStatus(itemList);

    if (isExpanded) {
      getModuleStartAndEndTime(
        modules.assignTrainingId,
        modules.courseId,
        moduleId,
        0
      ).then((response) => {
        console.log("response", response);
      });
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded((prev) => ({
      ...prev,
      [panel]: isExpanded ? panel : false,
    }));
  };

  const handlePassUrl = (topicUrl) => {
    setDefaultVideoUrl(topicUrl);
    console.log("Selected topic URL:", topicUrl);
  };

  useEffect(() => {
    const initialCompletedModules =
      modules?.modules?.length > 0 &&
      modules.modules.map((item) => item.status === "completed");
    setCompletedModules(initialCompletedModules);
  }, [modules]);

  const renderTreeLines = (level, showEndLine = false, isLastChild = false) => (
    <Box
      sx={{
        position: "absolute",
        left: `${level * 18}px`,
        top: -5,
      }}
    >
      <img src={Line} alt="line" />
      {(showEndLine || isLastChild) && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            display: "block",
            left: 0,
          }}
        >
          <img src={EndLine} alt="end line" />
        </Box>
      )}
    </Box>
  );

  const renderTopics = (topics, index) =>
    topics.map((topic, subIndex) => (
      <Accordion
        key={subIndex}
        expanded={
          expanded[`subPanel${index}-${subIndex}`] ===
          `subPanel${index}-${subIndex}`
        }
        onChange={handleChange(`subPanel${index}-${subIndex}`)}
        sx={{
          "&:before": { display: "none" },
          "& .MuiAccordionSummary-root": {
            minHeight: 40,
            mt: -0.5,
            backgroundColor:
              expanded[`panel${index}`] === `panel${index}`
                ? "#EEF9FF"
                : "#fff",
            "&.Mui-expanded": {
              minHeight: 40,
              backgroundColor: "#EEF9FF",
              mt: -1,
            },
            "& .MuiAccordionSummary-content": {
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            },
          },
          "& .MuiAccordionDetails-root": {
            position: "relative",
            paddingLeft: `${20}px`,
          },
          border: "none",
          boxShadow: "none",
        }}
        disabled={index > 0 && !completedModules[index - 1]}
      >
        <AccordionSummary
          aria-controls={`subPanel${index}-${subIndex}-content`}
          id={`subPanel${index}-${subIndex}-header`}
          sx={{ border: "0px solid black" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              ml: -1.5,
            }}
          >
            {renderTreeLines(
              -0.4,
              expanded[`subPanel${index}-${subIndex}`] ===
              `subPanel${index}-${subIndex}`,
              subIndex === topics.length - 1
            )}
            {expanded[`subPanel${index}-${subIndex}`] ? (
              <MdArrowDropDown size={16} />
            ) : (
              <MdArrowRight size={16} />
            )}
            <Typography
              sx={{
                ml: 0.5,
                flexGrow: 1,
                fontSize: "13px",
                fontWeight: 500,
                width: "100%",
              }}
            >
              <button
                type="button"
                onClick={() => handlePassUrl(topic.topicUrlEnglish)}
              >
                {topic.topicNameEng}
              </button>
            </Typography>
          </Box>
        </AccordionSummary>
      </Accordion>
    ));
  console.log("modules", modules, location);
  //
  // http://192.168.0.43:7100/training/moduleStartAndEndTime/22/49/51/0
  // "modulePreAssId": 35,
  // "isModulePreAss": true,

  useEffect(() => {
    if (expanded1) {
    }
  }, [expanded1]);

  return (
    <div>
      {modules?.modules !== undefined &&
        modules?.modules?.length > 0 &&
        modules?.modules.map((item, index) => (
          <div>
            {console.log("expanded", item)}
            <Accordion
              key={index}
              expanded={expanded1[`panel${index}`] === `panel${index}`}
              onChange={(event, isExpanded) =>
                handleChangeExpanded1(
                  `panel${index}`,
                  event,
                  isExpanded,
                  item.moduleid,
                  item
                )
              }
              sx={{
                mt: 0.5,
                border: "0.5px solid #E8E9EB",
                borderRadius: 2,
                overflow: "hidden",
                "&:before": { display: "none" },
                "&:first-of-type": {
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                },
                "&:last-of-type": {
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                },
                "& .MuiAccordionSummary-root": {
                  minHeight: 40,
                  backgroundColor:
                    expanded1[`panel${index}`] === `panel${index}`
                      ? "#CCEDFF"
                      : "#fff",
                  "&.Mui-expanded": {
                    minHeight: 40,
                    backgroundColor: "#CCEDFF",
                  },
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  },
                },
                "& .MuiAccordionDetails-root": {
                  backgroundColor: "#EEF9FF",
                  position: "relative",
                  paddingLeft: `${20}px`,
                },
              }}
              disabled={index > 0 && !completedModules[index - 1]}
            >
              <AccordionSummary
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {expanded1[`panel${index}`] === `panel${index}` ? (
                    <MdArrowDropDown size={20} />
                  ) : (
                    <MdArrowRight size={20} />
                  )}
                  <Typography
                    sx={{
                      ml: 0.5,
                      flexGrow: 1,
                      fontSize: "13.5px",
                      fontWeight: 600,
                    }}
                  >
                    {item?.moduleName}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <h1
                    className={
                      item?.status === "Pending"
                        ? "text-[12px] bg-[#F5801C] text-white px-2 py-0.5 rounded-md font-medium"
                        : "text-[12px] bg-[#2196f3] text-white px-2 py-0.5 rounded-md font-medium"
                    }
                  >
                    {item?.status}
                  </h1>
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  backgroundColor: "#E6F4FF",
                  padding: "9px 5px 0px 0px",
                  pb: 0.5,
                }}
              >
                <Box sx={{ position: "relative", pl: 0, ml: "0rem" }}>
                  {/* Render Pre-Assessment Section */}
                  {item?.modules?.modulepreassid && (
                    <Accordion
                      key={`${index}-preass`}
                      expanded={
                        expanded[`preassPanel${index}`] ===
                        `preassPanel${index}`
                      }
                      onChange={handleChange(`preassPanel${index}`)}
                      sx={{
                        "&:before": { display: "none" },
                        "& .MuiAccordionSummary-root": {
                          minHeight: 40,
                          mt: -0.5,
                          backgroundColor:
                            expanded[`panel${index}`] === `panel${index}`
                              ? "#EEF9FF"
                              : "#fff",
                          "&.Mui-expanded": {
                            minHeight: 40,
                            backgroundColor: "#EEF9FF",
                            mt: -1,
                          },
                          "& .MuiAccordionSummary-content": {
                            margin: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          },
                        },
                        "& .MuiAccordionDetails-root": {
                          position: "relative",
                          paddingLeft: `${20}px`,
                        },
                        border: "none",
                        boxShadow: "none",
                      }}
                      disabled={index > 0 && !completedModules[index - 1]} // Disable if previous module is not completed
                    >
                      <AccordionSummary
                        aria-controls={`preassPanel${index}-content`}
                        id={`preassPanel${index}-header`}
                        sx={{ border: "0px solid black" }}
                        disableTouchRipple
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            ml: -1.5,
                          }}
                        >
                          {renderTreeLines(
                            -0.4,
                            expanded[`preassPanel${index}`] ===
                            `preassPanel${index}`,
                            true
                          )}
                          {expanded[`preassPanel${index}`] ? (
                            <MdArrowDropDown size={16} />
                          ) : (
                            <MdArrowRight size={16} />
                          )}
                          <Typography
                            sx={{
                              ml: 0.5,
                              flexGrow: 1,
                              fontSize: "13px",
                              fontWeight: 500,
                              width: "100%",
                            }}
                          >
                            <button type="button">
                              {item?.modules?.modulepreassname}
                            </button>
                          </Typography>
                        </Box>
                      </AccordionSummary>
                    </Accordion>
                  )}
                  {item.isModulePreAss && item.modulePreAssId !== null ? (
                    <li className="text-xs my-1 font-semibold">
                      Pre Assesment
                    </li>
                  ) : (
                    ""
                  )}
                  {item.isModulePreAss && item.modulePreAssId !== null ? (
                    <p className="text-xs my-1 ml-2 flex space-x-2 items-center">
                      <span>
                        <ArrowDropDownIcon fontSize="small" />
                      </span>
                      <span> {item.modulePreAssName}</span>
                    </p>
                  ) : (
                    ""
                  )}
                  <li className="text-xs my-1 font-semibold">Topics</li>
                  {/* Render Topics */}
                  {renderTopics(item?.topics, index)}

                  {item.isModulePostAss && item.modulePostAssId !== null ? (
                    <li className="text-xs my-1 font-semibold">
                      Pre Assesment
                    </li>
                  ) : (
                    ""
                  )}
                  {item.isModulePostAss && item.modulePostAssId !== null ? (
                    <p className="text-xs my-1 ml-2 flex space-x-2 items-center">
                      <span>
                        <ArrowDropDownIcon fontSize="small" />
                      </span>
                      <span> {item.modulePostAssName}</span>
                    </p>
                  ) : (
                    ""
                  )}

                  {/* Render Post-Assessment Section */}
                  {item?.modulepostassid && (
                    <Box
                      sx={{
                        position: "relative",
                        height: 40,
                        gap: "5px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#475467",
                        pl: 2,
                        mt: "0rem",
                        border: "0px solid black",
                        backgroundColor: "#FEE3E3",
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <img
                          src={QuizIcon}
                          alt="quiz_icon"
                          style={{ height: "18.5px" }}
                        />
                      </div>
                      <p className="text-[13px] pr-4">(0/20)</p>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
    </div>
  );
}

export default CustomAccordion;
