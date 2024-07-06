import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
import { IoCloudUploadOutline, IoSearch } from "react-icons/io5";
import { MdAttachFile, MdDeleteOutline } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import CommonTable from "../../../common/CommonTable";
// import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "sonner";
import * as yup from "yup";
import CommonCheckbox from "../../../common/CommonCheckbox";
import DropdownField from "../../../common/CommonDropDown";
import CommonLoader from "../../../common/CommonLoader";
import { API_BASE_URL } from "../../../http_Common";
import {
  deleteModule,
  fetchAllModuleList,
  fetchEditModuleData,
  fetchPostAssessDropdown,
  fetchPreAssessDropdown,
  fetchTopicDropdown,
} from "../../../services/modulemaster/ModuleMaster";
import Sub_Topic_Table from "./SubTopicTable";

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

function Module_Master() {
  const schema = yup.object().shape({
    SelectedTopic: yup
      .object()
      .shape({
        value: yup.string(),
        label: yup.string(),
      })
      .required("topic is required"),
    ModuleName: yup.string().required("Name is required"),
  });

  const defaultValues = {
    Document: "",
    ModuleName: "",
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
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [preAssessmentEnabled, setPreAssessmentEnabled] = useState(false);
  const [postAssessmentEnabled, setPostAssessmentEnabled] = useState(false);
  const [topicsInModule, setTopicsInModule] = useState([]);
  const [searching, setSearching] = useState("");
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditIndex(null);
    reset();
    setUploadedFiles({});
    setPreAssessmentEnabled(false);
    setPostAssessmentEnabled(false);
    setTopicsInModule([]);
  };

  const onFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Content = reader.result.split(",")[1];
        setUploadedFiles({
          base64Content: base64Content,
          fileName: file.name,
        });
        setValue("Document", file);
      };
      reader.onerror = (error) => {
        console.error("Error reading the file:", error);
      };
    }
  };

  const showAllTopicList = () => {
    setLoading(true);
    fetchAllModuleList(searching, page, rowsPerPage)
      .then((res) => {
        setListing(res.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topic list:", error);
        setLoading(false);
      });
  };

  const onSubmit = async (data, index) => {
    let moduleId = null;
    if (
      isEditing &&
      editIndex !== null &&
      editIndex >= 0 &&
      editIndex < listing.length
    ) {
      moduleId = listing[editIndex].Id;
    }
    console.log("yvvchhvhcvshc", moduleId);

    const topicModuleRequestList = topicsInModule.map((topic) => ({
      topicId: {
        id: topic.id,
      },
    }));

    const payload = {
      id: moduleId ?? null,
      moduleName: data.ModuleName,
      moduleDocumentPath: uploadedFiles.base64Content ?? null,
      documentFileName: uploadedFiles.fileName ?? null,
      isPreAssessment: preAssessmentEnabled,
      ...(preAssessmentEnabled && {
        preAssessmentId: {
          id: preAssessmentEnabled ? data.PreTopic?.id ?? null : null,
        },
      }),
      isPostAssessment: postAssessmentEnabled,
      ...(postAssessmentEnabled && {
        postAssessmentId: {
          id: postAssessmentEnabled ? data.PostTopic?.id ?? null : null,
        },
      }),
      isActive: data.isActive,
      topicModuleRequestList: topicModuleRequestList
        ? topicModuleRequestList
        : null,
      createdBy: editIndex ? null : 1,
      lastModifiedBy: editIndex ? 2 : null,
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/coursesMaster/saveModule`,
        payload
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
    const moduleData = listing[index];
    const id = moduleData.Id;
    try {
      const res = await fetchEditModuleData(id);
      const module = res.result[0];

      reset();
      setUploadedFiles({
        base64Content: module.moduleDocumentPath,
        fileName: module.documentFileName,
      });
      setPreAssessmentEnabled(module.isPreAssessment);
      setPostAssessmentEnabled(module.isPostAssessment);
      setIsEditing(true);
      setEditIndex(index);

      setValue("ModuleName", module.moduleName);
      setValue("isActive", module.isActive);
      setValue("PreAssessment", module.isPreAssessment);
      setValue("PostAssessment", module.isPostAssessment);
      setValue("PreTopic", {
        id: module.preAssId,
        label: module.preAssLabel,
      });
      setValue("PostTopic", {
        id: module.postAssId,
        label: module.postAssLabel,
      });

      const topics = JSON.parse(module.topicModule).map((topic) => ({
        id: topic.topicId.id,
        label: topic.topicId.topicName,
      }));
      setTopicsInModule(topics);
      // toast.success(`Succefully Module ${isEditing ? 'Updated' : 'Created'} `)
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (index) => {
    const topicData = listing[index];
    const id = topicData.Id;
    try {
      await deleteModule(id);
      showAllTopicList();
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
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
        {header === "Module Name" && <p className="pl-2">{row[header]}</p>}
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

  useEffect(() => {
    showAllTopicList();
  }, [searching]);

  return (
    <div>
      <div className="">
        <h1 className="text-[20px] font-semibold text-center">Modules</h1>
        <div className="flex items-center justify-between mt-3">
          <div className="w-[25%]">
            <TextField
              variant="outlined"
              label="Search Module Name"
              size="small"
              placeholder="Search Module Name"
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
            Add New Module
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
                  "Status",
                  "Created Date",
                  "Module Name",
                  "Created By",
                  "Sr. No.",
                  "Topic Name",
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
        <ModuleCreationModal
          open={open}
          isEditing={isEditing}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          control={control}
          defaultValues={defaultValues}
          setPostAssessmentEnabled={setPostAssessmentEnabled}
          setPreAssessmentEnabled={setPreAssessmentEnabled}
          errors={errors}
          onFileUpload={onFileUpload}
          uploadedFiles={uploadedFiles}
          preAssessmentEnabled={preAssessmentEnabled}
          postAssessmentEnabled={postAssessmentEnabled}
          addTopicToModule={addTopicToModule}
          topicsInModule={topicsInModule}
          reset={reset}
          setTopicsInModule={setTopicsInModule}
        />
      )}
    </div>
  );
}

export default React.memo(Module_Master);

function ModuleCreationModal({
  open,
  isEditing,
  handleClose,
  handleSubmit,
  onSubmit,
  control,
  defaultValues,
  setPostAssessmentEnabled,
  setPreAssessmentEnabled,
  onFileUpload,
  errors,
  uploadedFiles,
  postAssessmentEnabled,
  preAssessmentEnabled,
  addTopicToModule,
  setTopicsInModule,
  topicsInModule,
  reset
}) {
  const [topicDropdDown, setTopicDropdDown] = useState([]);
  const [preDropDown, setPreDropDown] = useState([]);
  const [postDropDown, setPostDropDown] = useState([]);

  useEffect(() => {
    fetchTopicDropdown()
      .then((res) => {
        setTopicDropdDown(res.result);
      })
      .catch((error) => {
        console.log("error", error);
      });
    // ------------- pre data ------------//
    fetchPreAssessDropdown()
      .then((res) => {
        setPreDropDown(res.result);
      })
      .catch((error) => {
        console.log("error", error);
      });
    // ----------- post data ---------//
    fetchPostAssessDropdown()
      .then((res) => {
        setPostDropDown(res.result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  return (
    <>
      {/* --------------------- Modal section -------------------- */}
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
              {isEditing ? "Update Module" : "Add New Module"}
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
                      name="ModuleName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant="outlined"
                          label="Module Name"
                          size="small"
                          placeholder="Module Name"
                          defaultValue={defaultValues}
                          error={errors?.ModuleName}
                          sx={{
                            width: "40%",
                            "& .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root":
                            {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      )}
                    />
                    <div className="flex items-center ">
                      <input
                        accept=".pdf,.txt"
                        id={`upload`}
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => onFileUpload(e)}
                        className=""
                      />
                      <label htmlFor="upload">
                        <Button
                          type="button"
                          variant="outlined"
                          color="primary"
                          sx={{
                            py: 1,
                            mr: 0.2,
                            fontSize: "13px",
                            gap: "5px",
                            borderRadius: "8px",
                          }}
                          component="span"
                        >
                          <IoCloudUploadOutline size={19} /> Upload Document
                        </Button>
                      </label>
                      {uploadedFiles.fileName && (
                        <p className="flex items-center space-x-0.5 text-[15px]">
                          <MdAttachFile />
                          {uploadedFiles.fileName}
                        </p>
                      )}
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
                {/* -------------------------------------------------------------------------- */}
                <div className="w-full border shadow-md rounded-lg border-gray-300 my-2 py-2 px-4 flex items-center justify-betwee">
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
                  {/* ---------------------------------- */}
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
                        isDisabled={!postAssessmentEnabled ? true : false}
                        defaultValue={defaultValues}
                      />
                    </div>
                  </div>
                </div>
                {/* -------------------------------------------------------------- */}
                <div className="border border-gray-300 rounded-lg p-3.5 mt-3 shadow-md">
                  <div className="flex items-center w-full space-x-0 mt-1">
                    <div className="w-[30%]">
                      <h2 className="text-[15px] font-semibold">
                        Topics In Module :
                      </h2>
                    </div>
                    <div className="w-full flex items-center space-x-3">
                      <div className="w-[50%]">
                        <DropdownField
                          name="SelectedTopic"
                          isSearchable={true}
                          control={control}
                          dataArray={topicDropdDown}
                          error={errors.SelectedTopic}
                          placeholder={"Select Topic"}
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
                  {/* ----------------------------------------- */}
                  <Sub_Topic_Table
                    topicsInModule={topicsInModule}
                    // handleDeleteModule={handleDeleteModule}
                    setTopicsInModule={setTopicsInModule}
                  />
                </div>
                {/* ---------------------------------- button -------------------- */}
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