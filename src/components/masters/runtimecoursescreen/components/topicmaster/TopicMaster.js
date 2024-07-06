import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  IoCloseCircleOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoSearch,
} from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { toast } from "sonner";
import CommonCheckbox from "../../../../../common/CommonCheckbox";
import CommonLoader from "../../../../../common/CommonLoader";
import CommonTable from "../../../../../common/CommonTable";
import { API_BASE_URL } from "../../../../../http_Common";
import {
  deleteTopic,
  fetchAllTopicList,
  fetchEditTopicData,
} from "../../services/topicmaster/TopicMaster";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 850,
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 3,
  py: 1,
  borderRadius: 4,
};

const languages = ["English", "Hindi", "Local"];

const TopicMaster = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      English: true,
      VideoUrl: "",
      Document: "",
    },
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [listing, setListing] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searching, setSearching] = useState("");
  const [loading, setLoading] = useState(true);

  const watchedCheckboxes = watch(
    languages.reduce((acc, lang) => ({ ...acc, [lang]: false }), {})
  );
  const watchedEnglishFields = watch(["EnglishTopicName", "EnglishVideoUrl"]);
  const watchedHindiFields = watch(["HindiTopicName", "HindiVideoUrl"]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditId(null);
    reset();
    setUploadedFiles(null);
  };

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

  const onCheckboxChange = (language, checked) => {
    setValue(language, checked);
  };

  const onSubmit = async (formData) => {
    const newObj = {
      id: isEditing ? editId : null,
      createdBy: isEditing ? null : 1,
      lastModifiedBy: isEditing ? 2 : null,
      isActive: formData.isActive,
      docFileNameEnglish: uploadedFiles.English
        ? uploadedFiles.English.name
        : null,
      docFileNameHindi: uploadedFiles.Hindi ? uploadedFiles.Hindi.name : null,
      docFileNameLocal: uploadedFiles.Local ? uploadedFiles.Local.name : null,
    };

    // Prepare newObj with language-specific data
    languages.forEach((language) => {
      const docFileNameKey = `docFileName${language}`;
      const docPathKey = `docPath${language}`;

      if (formData[language]) {
        newObj[docFileNameKey] = uploadedFiles[language]
          ? uploadedFiles[language].name
          : null;
        newObj[`topic${language}`] = {
          [`topicName${language}`]: formData[`${language}TopicName`],
          [`topicUrl${language}`]: formData[`${language}VideoUrl`],
          [docPathKey]: uploadedFiles[language]
            ? uploadedFiles[language].content
            : null,
        };
      }
    });

    console.log("Payload to send:", newObj);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/coursesMaster/saveTopics`,
        newObj
      );
      console.log("Response:", res);
      showAllTopicList();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    reset();
  };

  const showAllTopicList = () => {
    setLoading(true);
    fetchAllTopicList(searching, page, rowsPerPage)
      .then((res) => {
        setListing(res.result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching topic list:", error);
      });
  };

  const handleDelete = async (index) => {
    const topicData = listing[index];
    const id = topicData.Id;
    try {
      await deleteTopic(id);
      showAllTopicList();
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const handleEdit = async (index) => {
    const topicData = listing[index];
    const id = topicData.Id;

    try {
      const res = await fetchEditTopicData(id);
      const topic = res.result[0];
      const formattedResult = {
        ...topic,
        topicEnglish: JSON.parse(topic?.topicEnglish),
        topicHindi: JSON.parse(topic?.topicHindi),
        topicLocal: JSON.parse(topic?.topicLocal),
      };

      reset();
      setEditId(id);
      languages.forEach((language) => {
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

      setValue("isActive", formattedResult.isActive);
      setIsEditing(true);
      handleOpen();
    } catch (error) {
      console.error("Error fetching or setting topic data:", error);
      toast.error("Something went wrong while fetching topic data.");
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
        {header === "Last Modified By" && <p className="pl-3">{row[header]}</p>}
        {header === "Last Modified Date" && (
          <p className="pl-1">{row[header]}</p>
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

  const SearchData = useCallback(
    (event) => {
      const value = event.target.value;
      setSearchString(value);
      if (value !== "") {
        setSearching(value);
      } else {
        setListing(listing);
        setSearching("");
      }
    },
    [listing, searching]
  );

  useEffect(() => {
    showAllTopicList();
  }, []);

  return (
    <div>
      <h1 className="text-[20px] font-semibold text-center">Topics</h1>
      <div className="flex items-center justify-between mt-3">
        <div className="w-[25%]">
          <TextField
            variant="outlined"
            label="Search Topics Name"
            size="small"
            placeholder="Search Topic Name"
            value={searchString}
            onChange={SearchData}
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
          Add New Topic
        </button>
      </div>
      <div className={`${listing.length > 0 ? "mt-6" : "mt-14"}`}>
        {loading ? (
          <CommonLoader />
        ) : listing && listing.length > 0 ? (
          <CommonTable
            dataResult={listing}
            rowsPerPage={rowsPerPage}
            renderActions={renderAction}
            setPage={setPage}
            tableClass="h-96"
            count={listing.length}
            page={page}
            populateTable={() => { }}
            setRowsPerPage={setRowsPerPage}
            editableColumns={[
              "Status",
              "Created Date",
              "Created By",
              "Sr. No.",
              "Topic Name",
              "Last Modified By",
              "Last Modified Date",
            ]}
            removeHeaders={["Id"]}
            renderInput={renderInput}
          />
        ) : (
          <p className="text-center font-semibold  my-28 w-full text-gray-600">
            No Record Found<span className="animate-pulse">...</span>
          </p>
        )}
      </div>
      {/* --------------------------------------- Modal ---------------------------------- */}
      {open && (
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
                {isEditing ? "Edit Topic" : "Add New Topic"}
              </h1>
              <IconButton onClick={handleClose}>
                <IoCloseCircleOutline color="red" />
              </IconButton>
            </Typography>
            <hr className="bg-black my-1" />
            <form onSubmit={handleSubmit(onSubmit)} className="-mt-0">
              <div className="">
                <div className="flex flex-row space-x-4">
                  {languages?.length > 0 &&
                    languages.map((language) => (
                      <Controller
                        key={language}
                        name={language}
                        control={control}
                        render={({ field }) => (
                          <CommonCheckbox
                            label={language}
                            checked={field.value}
                            onChange={(e) =>
                              onCheckboxChange(language, e.target.checked)
                            }
                            disabled={
                              (language === "Hindi" &&
                                (!watchedEnglishFields[0] ||
                                  !watchedEnglishFields[1])) ||
                              (language === "Local" &&
                                (!watchedHindiFields[0] ||
                                  !watchedHindiFields[1]))
                            }
                          />
                        )}
                      />
                    ))}
                </div>
                {languages?.length > 0 &&
                  languages.map(
                    (language) =>
                      watchedCheckboxes[language] && (
                        <div
                          key={language}
                          className="flex flex-row items-center space-x-4 mt-3"
                        >
                          <Controller
                            name={`${language}TopicName`}
                            control={control}
                            rules={{
                              required: `${language} topic name is required`,
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={`${language} Topic Name`}
                                variant="outlined"
                                size="small"
                                error={!!errors[`${language}TopicName`]}
                                sx={{
                                  "& .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root":
                                  {
                                    borderRadius: "8px",
                                  },
                                }}
                              />
                            )}
                          />
                          <Controller
                            name={`${language}VideoUrl`}
                            control={control}
                            rules={{
                              required: `${language} video URL is required`,
                              pattern: {
                                value:
                                  /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                                message: "Enter a valid URL",
                              },
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={`${language} Video URL`}
                                variant="outlined"
                                size="small"
                                error={!!errors[`${language}VideoUrl`]}
                                sx={{
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
                                  py: 1,
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
              <div className="mt-4 flex items-center justify-between">
                <div className="mb-2">
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
                <div className="text-right my-2 space-x-3">
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>

                  <Button type="submit" variant="contained" color="success">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default TopicMaster;
