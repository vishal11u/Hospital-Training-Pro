import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { IoSearch } from "react-icons/io5";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";
import { AssignCourse } from "../../../services/assigncourse/CourseAssign";
// import { toast } from 'sonner';
import Video_Img from "../../../assets/dashboard-img/59c20914e679af6311925f0d6889eddd.jpeg";
import Cinema_svg from "../../../assets/dashboard-img/Cinema.svg";
import Play_svg from "../../../assets/dashboard-img/Ellipse 25.svg";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#073763" : "#308fe8",
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

function Course_Video_Intro() {
  const navigate = useNavigate();
  const [assignCourses, setAssignCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignCourse = () => {
    AssignCourse(3)
      .then((res) => {
        setAssignCourses(JSON.parse(res.result));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBgColorStatus = (status) => {
    if (status === "Pending") {
      return "#F5801C";
    } else if (status === "Completed") {
      return "#4CAF50";
    } else {
      return "#2196F3";
    }
  };

  useEffect(() => {
    fetchAssignCourse();
  }, []);

  return (
    <React.Fragment>
      <div className="text-center">
        <h1 className="font-semibold text-[20px]">Courses Section</h1>
      </div>
      {/* ------------------------------------- Search Field --------------------------- */}
      <div className="mt-5">
        <TextField
          variant="outlined"
          label="Search Assigned Courses"
          size="small"
          placeholder="Search Assigned Courses"
          sx={{
            width: 380,
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

      {/* ------------------------------- training videos section -------------------------------- */}
      <div className="mt-6">
        {!loading ? (
          assignCourses?.length > 0 ? (
            <div className="grid grid-cols-4 gap-x-5 gap-y-3">
              {assignCourses.map((item) => (
                <div
                  className="border w-[100%] overflow-hidden shadow-md cursor-pointer"
                  style={{ borderRadius: "10px 10px 10px 10px" }}
                  key={item.courseId}
                  onClick={() =>
                    navigate(`/preassesmenttext/${item?.courseId}`, {
                      state: { course: item },
                    })
                  }
                >
                  <div className="relative w-[340px] h-[210px]">
                    <div className="relative z-0 w-full h-full overflow-hidden border">
                      <img
                        src={Video_Img}
                        loading="lazy"
                        alt="V_img"
                        className="h-full w-full object-cover drop-shadow-md"
                      />
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                    <div className="absolute inset-0 md:right-16 lg:right-12 xl:right-7 flex items-center justify-center z-20">
                      <img
                        src={Play_svg}
                        alt="play_svg"
                        className="h-14 w-14"
                      />
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h1 className="text-[13px] font-semibold">
                      {item?.courseName}
                    </h1>
                    <div className="flex items-center justify-between w-full mt-1">
                      <div className="flex items-center ">
                        <img src={Cinema_svg} alt="cinema_img" />
                        <p className="text-[11px] font-semibold">
                          {item?.modules} Sessions {item?.isCoursePreAss}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <p
                          className="text-[12px] font-medium px-3 py-1"
                          style={{
                            backgroundColor: getBgColorStatus(item?.status),
                            color: "white",
                            borderRadius: "5px",
                          }}
                        >
                          {item?.status}
                        </p>
                      </div>
                    </div>
                    <div className="-mx-2.5 -mb-2.5">
                      <button
                        type="button"
                        className="bg-[#F5801C] w-full py-2.5 mt-2 font-medium text-[14px] text-white"
                      >
                        {item?.progress > 0 ? "Resume Course" : "Start Course"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center my-28 text-gray-600 font-semibold ">
              No Assigned Courses Available
              <span className="animate-pulse">...</span>
            </p>
          )
        ) : (
          <>
            {Array?.length > 0 && (
              <div className="grid grid-cols-4 gap-x-5 gap-y-3">
                {[...Array(4).keys()].map((index) => (
                  <Box
                    key={index}
                    sx={{ width: 300, border: "0px solid gray" }}
                  >
                    <Skeleton
                      animation="pulse"
                      sx={{
                        width: 300,
                        height: 350,
                        borderRadius: 3,
                        bgcolor: "grey.400",
                        mt: -9,
                      }}
                    />
                    <div className="flex items-center justify-between -mt-12">
                      <Skeleton
                        animation="pulse"
                        sx={{
                          width: 100,
                          height: 40,
                          bgcolor: "grey.400",
                        }}
                      />
                      <Skeleton
                        animation="pulse"
                        sx={{
                          width: 50,
                          height: 40,
                          bgcolor: "grey.400",
                        }}
                      />
                    </div>
                    <Skeleton
                      animation="pulse"
                      sx={{
                        width: 300,
                        height: 50,
                        mt: -0.3,
                        bgcolor: "grey.400",
                      }}
                    />
                  </Box>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export default Course_Video_Intro;
