import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Box,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseCircleOutline, IoSearch } from "react-icons/io5";
import * as yup from "yup";
import DropdownField from "../../../../../common/CommonDropDown";
import CommonDatePickerDayjs from "../../../../../common/CommonDatePickerDatefns";
import {
  fetchCourseDropDown,
  fetchEmployeeDropDown,
  getAssignTrainingList,
} from "../../services/assigntraining/AssignTraining";
import axios from "axios";
import { API_BASE_URL } from "../../../../../http_Common";
import { toast } from "sonner";
import { format } from "date-fns";
import SearchDropdown from "../../../../../common/FormFields/searchDropdown";
import CommonDynamicTablePaginationNew from "../../../../../common/CommonTable/CommonTransactionPaginationTable";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 3,
  py: 1,
  borderRadius: 4,
};

function Assign_Training() {
  const schema = yup.object().shape({
    employees: yup
      .object()
      .shape({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .required("Employee is required"),
    course: yup
      .object()
      .shape({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .required("Course is required"),
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
  });

  const defaultValues = {
    searchByTraningName: null,
    employees: null,
    course: null,
    fromDate: "",
    toDate: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [open, setOpen] = useState(false);
  const [AssignTraningList, setAssignTraningList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(null);

  const populateAssignTraningListTable = () => {
    let tempObj = {
      id: null,
      searchString: null,
      page: page,
      size: rowsPerPage,
    };
    getAssignTrainingList(tempObj)
      .then((response) => {
        console.log("response", response);
        setAssignTraningList(response.result);
        setCount(response.count);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    populateAssignTraningListTable();
  }, []);

  const handleFromDate = (value) => {
    setValue("fromDate", value ? dayjs(value).format("YYYY-MM-DD") : "");
  };

  const handleToDate = (value) => {
    setValue("toDate", value ? dayjs(value).format("YYYY-MM-DD") : "");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    const moduleDetails = JSON.parse(data.course.moduledetails);
    console.log("moduleDetails", moduleDetails);
    const preAssId = data.course.preassid ? { id: data.course.preassid } : null;
    const postAssId = data.course.postassid
      ? { id: data.course.postassid }
      : null;

    const modulePreAssId = moduleDetails.map((module) =>
      module.isModulePreAss
        ? { id: module.modulePreAssId !== null ? module.modulePreAssId : null }
        : null
    );

    const modulePostAssId = moduleDetails.map((module) =>
      module.isModulePostAss
        ? {
          id: module.modulePostAssId !== null ? module.modulePostAssId : null,
        }
        : null
    );

    const payload = {
      employeesId: {
        id: data.employees.id,
      },
      courseId: {
        id: data.course.id,
      },
      validFromTime: format(new Date(data.fromDate), "yyyy-MM-dd"),
      validToTime: format(new Date(data.toDate), "yyyy-MM-dd"),
      isCoursePreAss: data.course.iscoursepreass,
      preAssId: preAssId,
      isCoursePostAss: data.course.iscoursepostass,
      postAssId: postAssId,
      moduleData: moduleDetails.map((module, index) => ({
        moduleId: {
          id: module.moduleId,
        },

        isModulePreAss: module.isModulePreAss,
        modulePreAssId: modulePreAssId[index],
        isModulePostAss: module.isModulePostAss,
        modulePostAssId: modulePostAssId[index],
        topics:
          module?.topics !== null
            ? module.topics.map((topic) => ({
              id: topic.topicId !== null ? topic.topicId : null,
            }))
            : null,
      })),
      assignById: 1,
    };

    // console.log("Payloadtobesent:", payload);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/training/assignTraining`,
        payload
      );
      console.log("Response", res);
      handleClose();
      toast("Assign Successfully");
      populateAssignTraningListTable()
    } catch (error) {
      console.error("Error:", error);
      toast(error.message);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="font-semibold text-[18px]">Assign Training</h1>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="w-[35%]">
          <SearchDropdown
            control={control}
            name="searchByTraningName"
            placeholder="Search By Traning Name"
            searchIcon={true}
            isClearable={true}
            handleInputChange={(e) => {
              console.log("traning Name", e);
            }}
          />
        </div>
        <button
          type="button"
          className="bg-[#073763] flex items-center gap-x-1 text-[14px] p-2 text-white rounded-md shadow transition-all hover:bg-gray-600"
          onClick={handleOpen}
        >
          <AddCircleOutlineIcon fontSize="small" />
          Assign Training
        </button>
      </div>
      {AssignTraningList?.length > 0 ? (
        <CommonDynamicTablePaginationNew
          dataResult={AssignTraningList}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          removeHeaders={["Id"]}
          count={count}
          setCount={setCount}
        />
      ) : (
        <h1 className="text-center text-[18px] font-semibold mt-12">No Record Found...</h1>
      )}
      {/* ------------------------ modal ---------------------------- */}
      {open && (
        <AssignTrainingModal
          open={open}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          control={control}
          errors={errors}
          reset={reset}
          defaultValues={defaultValues}
          handleFromDate={handleFromDate}
          handleToDate={handleToDate}
        />
      )}
    </div>
  );
}

export default Assign_Training;

function AssignTrainingModal({
  open,
  handleSubmit,
  onSubmit,
  handleClose,
  control,
  errors,
  defaultValues,
  reset,
  handleFromDate,
  handleToDate
}) {
  const [employeeDropDown, setEmployeeDropDown] = useState([]);
  const [courseDropDown, setCourseDropDown] = useState([]);

  useEffect(() => {
    fetchEmployeeDropDown()
      .then((res) => {
        setEmployeeDropDown(res.result);
      })
      .catch((err) => {
        console.log(err);
      });
    // ------------- course dropdown data ------------//
    fetchCourseDropDown()
      .then((res) => {
        setCourseDropDown(res.result);
      })
      .catch((err) => {
        console.log(err);
      });
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
            <h1 className="text-[20px] font-semibold">Assign Training</h1>
            <IconButton onClick={handleClose}>
              <IoCloseCircleOutline color="red" />
            </IconButton>
          </Typography>
          <hr className="bg-black my-1" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-5 flex items-center w-full space-x-4">
              <div className="w-[28%]">
                <DropdownField
                  name="employees"
                  control={control}
                  dataArray={employeeDropDown}
                  error={errors.employees}
                  placeholder={"Select Employee"}
                  defaultValue={defaultValues.employees}
                />
              </div>
              <div className="w-[28%]">
                <DropdownField
                  name="course"
                  control={control}
                  dataArray={courseDropDown}
                  error={errors.course}
                  placeholder={"Select Course"}
                  defaultValue={defaultValues.course}
                />
              </div>
              <div className="w-[20%]">
                <CommonDatePickerDayjs
                  name="fromDate"
                  control={control}
                  label="From Date"
                  onChange={handleFromDate}
                  error={!!errors.fromDate}
                  disablePast={true}
                />
              </div>
              <div className="w-[20%]">
                <CommonDatePickerDayjs
                  name="toDate"
                  control={control}
                  label="To Date"
                  onChange={handleToDate}
                  error={!!errors.toDate}
                  disablePast={true}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pb-1 -mt-1">
              <Button
                variant="outlined"
                color="error"
                onClick={() => reset(defaultValues)}
              >
                Reset
              </Button>
              <Button type="submit" variant="contained" color="success">
                Submit
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  )
}