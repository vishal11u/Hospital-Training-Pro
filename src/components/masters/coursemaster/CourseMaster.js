import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CommonTable from "../../../common/CommonTable";
import { RiEdit2Line } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { Controller, useForm } from "react-hook-form";
import DropdownField from "../../../common/CommonDropDown";
import CommonCheckbox from "../../../common/CommonCheckbox";
import { format } from "date-fns";
import Sub_Module_Table from "./SubModuleTable";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  fetchPostAssessDropdown,
  fetchPreAssessDropdown,
} from "../../../services/modulemaster/ModuleMaster";
import {
  deleteCourse,
  fetchAllCourseList,
  fetchCourseEdit,
  getDepartmentDropDown,
  getModuleDropDown,
} from "../../../services/coursemaster/CourseMaster";
import { API_BASE_URL } from "../../../http_Common";
import axios from "axios";
import { toast } from "sonner";
import CommonLoader from "../../../common/CommonLoader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 904,
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 3,
  py: 1,
  borderRadius: 4,
};

function Course_Master() {
  const schema = yup.object().shape({
    SelectedTopic: yup
      .object()
      .shape({
        value: yup.string(),
        label: yup.string(),
      })
      .required("topic is required"),
    // Department: yup.object().shape({
    //     value: yup.string(),
    //     label: yup.string()
    // }).required("topic is required"),
    CourseName: yup.string().required("Name is required"),
  });

  const defaultValues = {
    Department: "",
    CourseName: "",
    isActive: false,
    PreAssessment: false,
    PostAssessment: false,
    PreTopic: "",
    PostTopic: "",
    SelectedTopic: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [preAssessmentEnabled, setPreAssessmentEnabled] = useState(false);
  const [postAssessmentEnabled, setPostAssessmentEnabled] = useState(false);
  const [topicsInModule, setTopicsInModule] = useState([]);
  const [module, setModule] = useState([]);
  const [listing, setListing] = useState([]);
  const [searching, setSearching] = useState("");
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditIndex(null);
    reset();
    setPreAssessmentEnabled(false);
    setPostAssessmentEnabled(false);
    setTopicsInModule([]);
  };

  const showAllTopicList = () => {
    setLoading(true);
    fetchAllCourseList(searching, page, rowsPerPage)
      .then((res) => {
        setListing(res.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topic list:", error);
        setLoading(false);
      });
  };

  const removeNullKeys = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null)
    );
  };

  const onSubmit = async (data, index) => {
    let courseId = null;
    if (
      isEditing &&
      editIndex !== null &&
      editIndex >= 0 &&
      editIndex < listing.length
    ) {
      courseId = listing[editIndex].Id;
    }

    const topicModuleRequestList = module.map((topic) => ({
      moduleId: {
        id: topic.id,
      },
    }));

    const departmentIds = data?.Department?.id
      ? { id: data.Department.id }
      : null;

    const payload = {
      id: courseId ?? null,
      courseName: data?.CourseName,
      departmentId: departmentIds,
      isPreAssessment: preAssessmentEnabled,
      preAssessmentId: preAssessmentEnabled ? { id: data?.PreTopic?.id } : null,
      isPostAssessment: postAssessmentEnabled,
      postAssessmentId: postAssessmentEnabled
        ? { id: data?.PostTopic?.id }
        : null,
      isActive: data?.isActive,
      createdBy: isEditing ? null : 1,
      lastModifiedBy: isEditing ? 2 : null,
      courseModuleRequestList: topicModuleRequestList,
    };

    // Remove null keys from the payload
    const cleanedPayload = removeNullKeys(payload);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/coursesMaster/saveCourse`,
        cleanedPayload
      );
      console.log("Response:", res.data);
      showAllTopicList();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addTopicToModule = () => {
    const selectedTopic = watch("SelectedTopic");
    if (
      selectedTopic &&
      !topicsInModule.some((topic) => topic.id === selectedTopic.id)
    ) {
      setTopicsInModule([...topicsInModule, selectedTopic]);
    }
    // setValue('SelectedTopic', null);
  };

  const handleEditModule = async (index) => {
    handleOpen();
    const courseId = listing[index].Id;
    try {
      const res = await fetchCourseEdit(courseId);
      const course = res.result[0];

      reset();
      setPreAssessmentEnabled(course.isPreAssessment);
      setPostAssessmentEnabled(course.isPostAssessment);
      setIsEditing(true);
      setEditIndex(index);

      setValue("CourseName", course.courseName);
      setValue("isActive", course.isActive);
      setValue("PreAssessment", course.isPreAssessment);
      setValue("PostAssessment", course.isPostAssessment);
      setValue("Department", {
        id: course.departmentId,
        label: course.departmentLabel,
      });
      setValue(
        "PreTopic",
        course.preAssId
          ? {
            id: course.preAssId,
            label: course.preAssLabel,
          }
          : null
      );
      setValue(
        "PostTopic",
        course.postAssId
          ? {
            id: course.postAssId,
            label: course.postAssLabel,
          }
          : null
      );

      const modules = course.courseModule
        ? JSON.parse(course.courseModule).map((module) => ({
          id: module.moduleId.id,
          label: module.moduleName,
          ispreass: module?.ispreass,
          ispostass: module?.ispostass,
        }))
        : [];
      console.log("hsvdhvsdhvh", modules);
      setTopicsInModule(modules);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error(error.message);
    }
  };

  // console.log("bfihdbhb", topicsInModule);

  const renderInput = useCallback((row, index, header) => {
    return (
      <div className="py-1 font-medium">
        {header === "Status" && (
          <p
            className={`w-[90%] -ml-3 font-medium ${row.Status === false
              ? "text-[#EF4712] text-center py-1 bg-[#EF12121A] rounded"
              : "text-[#3FC28A] py-1 text-center bg-[#3FC28A1A] rounded"
              }`}
          >
            {row[header] === true ? "Active" : "Inactive"}
          </p>
        )}
        {header === "Created Date" && <p className="pl-0.5">{row[header]}</p>}
        {header === "Created By" && <p className="pl-1">{row[header]}</p>}
        {header === "Sr. No." && (
          <p className="text-center w-1/2">{row[header]}</p>
        )}
        {header === "Course Name" && <p className="pl-2.5">{row[header]}</p>}
        {header === "Last Modified Date" && (
          <p className="pl-1">{row[header]}</p>
        )}
        {header === "Last Modified By" && (
          <p className="pl-1.5">{row[header]}</p>
        )}
      </div>
    );
  }, []);

  const renderAction = (row, index) => {
    return (
      <div className="flex items-center space-x-2 ml-1">
        <button
          type="button"
          className="text-blue-500"
          onClick={() => handleEditModule(index)}
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

  const handleDelete = async (index) => {
    const topicData = listing[index];
    const id = topicData.Id;
    try {
      await deleteCourse(id);
      showAllTopicList();
      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    showAllTopicList();
  }, [searching]);

  return (
    <div>
      <div className="">
        <h1 className="text-[20px] font-semibold text-center">Courses</h1>
        <div className="flex items-center justify-between mt-3">
          <div className="w-[25%]">
            <TextField
              variant="outlined"
              label="Search Course Name"
              size="small"
              placeholder="Search Course Name"
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
            Add New Course
          </button>
        </div>
        {loading ? (
          <CommonLoader />
        ) : (
          <div className={`${listing.length > 0 ? "mt-6" : "mt-14"}`}>
            {listing.length > 0 ? (
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
                  "Sr. No.",
                  "Status",
                  "Course Name",
                  "Created Date",
                  "Created By",
                  "Sr.no",
                  "Last Modified By",
                  "Last Modified Date",
                ]}
                removeHeaders={["Id"]}
                renderInput={renderInput}
                renderActions={renderAction}
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
        <CourseCreationModal
          open={open}
          onSubmit={onSubmit}
          setModule={setModule}
          isEditing={isEditing}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          control={control}
          reset={reset}
          errors={errors}
          defaultValues={defaultValues}
          preAssessmentEnabled={preAssessmentEnabled}
          postAssessmentEnabled={postAssessmentEnabled}
          setPostAssessmentEnabled={setPostAssessmentEnabled}
          setPreAssessmentEnabled={setPostAssessmentEnabled}
          topicsInModule={topicsInModule}
          setTopicsInModule={setTopicsInModule}
          addTopicToModule={addTopicToModule}
        />
      )}
    </div>
  );
}

export default React.memo(Course_Master);

function CourseCreationModal({
  open,
  setModule,
  isEditing,
  handleClose,
  handleSubmit,
  control,
  errors,
  onSubmit,
  defaultValues,
  preAssessmentEnabled,
  postAssessmentEnabled,
  reset,
  setPostAssessmentEnabled,
  setPreAssessmentEnabled,
  topicsInModule,
  setTopicsInModule,
  addTopicToModule
}) {
  const [department, setDepartment] = useState([]);
  const [preDropDown, setPreDropDown] = useState([]);
  const [postDropDown, setPostDropDown] = useState([]);

  useEffect(() => {
    fetchPreAssessDropdown()
      .then((res) => setPreDropDown(res.result))
      .catch((error) =>
        console.error("Error fetching pre-assessment dropdown:", error)
      );

    fetchPostAssessDropdown()
      .then((res) => setPostDropDown(res.result))
      .catch((error) =>
        console.error("Error fetching post-assessment dropdown:", error)
      );

    getDepartmentDropDown()
      .then((res) => setDepartment(res.result))
      .catch((error) =>
        console.error("Error fetching department dropdown:", error)
      );

    getModuleDropDown()
      .then((res) => setModule(res.result))
      .catch((error) =>
        console.error("Error fetching module dropdown:", error)
      );
  }, []);

  return (
    <>
      <Modal
        open={open}
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
              {isEditing ? "Update Course" : "Add New Course"}
            </h1>
            <IconButton onClick={handleClose}>
              <IoCloseCircleOutline color="red" />
            </IconButton>
          </Typography>
          <hr className="bg-black my-1" />
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, width: "100%" }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full">
                <div className="flex items-center">
                  <div className="flex items-center space-x-4 w-[80%]">
                    <Controller
                      name="CourseName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant="outlined"
                          label="Course Name"
                          size="small"
                          error={errors.CourseName}
                          placeholder="Course Name"
                          sx={{
                            width: "45%",
                            "& .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root":
                            {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      )}
                    />
                    <div className="w-[45%]">
                      <DropdownField
                        name="Department"
                        control={control}
                        dataArray={department}
                        error={errors.Department}
                        placeholder={"Select Department"}
                        defaultValue={defaultValues}
                      />
                    </div>
                  </div>
                  <div className="">
                    <Controller
                      name="isActive"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <CommonCheckbox
                          label="Active"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-full border shadow-md rounded-lg border-gray-300 my-2 py-2 px-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 mt-1 w-full">
                    <Controller
                      name="PreAssessment"
                      control={control}
                      render={({ field }) => (
                        <CommonCheckbox
                          label="Pre Assessment"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            setPreAssessmentEnabled(e.target.checked);
                          }}
                        />
                      )}
                    />
                    <div className="w-[54%]">
                      <DropdownField
                        name="PreTopic"
                        control={control}
                        dataArray={preDropDown}
                        error={errors.PreTopic}
                        placeholder={"Pre Assessment"}
                        isDisabled={!preAssessmentEnabled}
                        defaultValue={defaultValues}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 w-full">
                    <Controller
                      name="PostAssessment"
                      control={control}
                      render={({ field }) => (
                        <CommonCheckbox
                          label="Post Assessment"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            setPostAssessmentEnabled(e.target.checked);
                          }}
                        />
                      )}
                    />
                    <div className="w-[54%]">
                      <DropdownField
                        name="PostTopic"
                        control={control}
                        dataArray={postDropDown}
                        error={errors.PostTopic}
                        placeholder={"Post Assessment"}
                        isDisabled={!postAssessmentEnabled}
                        defaultValue={defaultValues}
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3.5 mt-3 shadow-md">
                  <div className="flex items-center w-full space-x-0 mt-1">
                    <div className="w-[30%]">
                      <h2 className="text-[15px] font-semibold">
                        Modules In Course :
                      </h2>
                    </div>
                    <div className="w-full flex items-center space-x-3">
                      <div className="w-[50%]">
                        <DropdownField
                          name="SelectedTopic"
                          isSearchable={true}
                          control={control}
                          dataArray={module}
                          error={errors.SelectedTopic}
                          placeholder={"Select Module"}
                        />
                      </div>
                      <div className="">
                        <Button
                          type="button"
                          variant="contained"
                          sx={{
                            py: 0.8,
                            mr: 0.2,
                            fontSize: "13px",
                            gap: "5px",
                            borderRadius: "8px",
                            backgroundColor: "#073763",
                          }}
                          component="span"
                          onClick={addTopicToModule}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Sub_Module_Table
                    topicsInModule={topicsInModule}
                    // handleDeleteModule={handleDeleteModule}
                    setTopicsInModule={setTopicsInModule}
                  />
                </div>
                <div className="w-full flex justify-end mt-3 mb-1 space-x-4">
                  <Button
                    type="reset"
                    variant="outlined"
                    color="error"
                    sx={{ borderRadius: 2 }}
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 2 }}
                  >
                    {isEditing ? "Update" : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </Typography>
        </Box>
      </Modal>
    </>
  )
}
