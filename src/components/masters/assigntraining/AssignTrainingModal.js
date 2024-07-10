import React, { useState, useEffect } from 'react';
import DatePickerField from "../../../common/FormFields/DatePickerField";
import axios from "axios";
import { API_BASE_URL } from "../../../http_Common";
import { toast } from "sonner";
import {
    fetchCourseDropDown,
    fetchEmployeeDropDown,
} from "../../../services/assigntraining/AssignTraining";
import { useForm } from "react-hook-form";
import { IoCloseCircleOutline } from "react-icons/io5";
import * as yup from "yup";
import DropdownField from "../../../common/CommonDropDown";
import {
    Box,
    IconButton,
    Modal,
    Typography,
    Button,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";

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

function AssignTrainingModal({
    open,
    handleClose,
    populateAssignTraningListTable
}) {
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
        fromDate: yup.date().nullable().required("From date is required"),
        toDate: yup.date().nullable().required("To date is required"),
    });

    const defaultValues = {
        employees: null,
        course: null,
        fromDate: null,
        toDate: null,
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });
    const [employeeDropDown, setEmployeeDropDown] = useState([]);
    const [courseDropDown, setCourseDropDown] = useState([]);

    const onSubmit = async (data) => {
        const moduleDetails = JSON.parse(data?.course?.moduledetails);
        // console.log("moduleDetails", data);
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
            validFromTime: data?.fromDate,
            validToTime: data?.toDate,
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

        try {
            const res = await axios.post(`${API_BASE_URL}/training/assignTraining`, payload);
            console.log("Response", res);
            handleClose();
            toast("Assign Successfully");
            populateAssignTraningListTable();
        } catch (error) {
            console.error("Error:", error);
        }
    };

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
                                <DatePickerField
                                    name="fromDate"
                                    control={control}
                                    label="From Date"
                                    error={errors?.fromDate}
                                    inputFormat={'yyyy-MM-dd'}
                                    disablePast={true}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </div>
                            <div className="w-[20%]">
                                <DatePickerField
                                    name="toDate"
                                    control={control}
                                    label="To Date"
                                    error={errors?.toDate}
                                    disablePast={true}
                                    inputFormat={'yyyy-MM-dd'}
                                    slotProps={{ textField: { size: 'small' } }}
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

export default AssignTrainingModal;