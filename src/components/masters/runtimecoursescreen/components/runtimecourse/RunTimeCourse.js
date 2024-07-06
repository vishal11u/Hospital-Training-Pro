import React, { useCallback, useEffect, useState } from 'react'
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useForm } from 'react-hook-form';
import SearchBar from '../../../../../common/FormFields/SearchBar';
import RunTimeCourseCreateModal from './RunTimeCourseCreateModal';
import { getRunTimeCourseList } from '../../services/runtimecourse/RunTimeCourse';
import { toast } from 'sonner';
import CommonLoader from '../../../../../common/CommonLoader';
import CommonTable from '../../../../../common/CommonTable';
import { MdDeleteOutline } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";

function RunTimeCourse() {
    const { control, reset, setValue } = useForm();

    const [runtimeCourseModalOpen, setRuntimeCourseModalOpen] = useState(false);
    const [runTimeCourseList, setRunTimeCourseList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState(null);
    const [listId, setListId] = useState(0);
    const [editData, setEditData] = useState(0)
    const [openEditModal, setOpenEditModal] = useState(false);

    const handleOpen = () => {
        setRuntimeCourseModalOpen(true);
    }

    const handleClose = () => {
        setRuntimeCourseModalOpen(false);
    }

    const renderInput = useCallback((row, index, header) => {
        return (
            <div className="py-1 font-medium">
                {header === "Status" && (
                    <p
                        className={`font-medium ${row.Status === false
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
                {header === "Assessment Name" && <p className="pl-2">{row[header]}</p>}
                {header === "Assessment Type" && <p className="pl-2">{row[header]}</p>}
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
                    onClick={() => handleEditModule(row)}
                >
                    <RiEdit2Line size={20} />
                </button>
                <button
                    type="button"
                    className="text-red-500"
                // onClick={() => handleDelete(index)}
                >
                    <MdDeleteOutline size={20} />
                </button>
            </div>
        );
    };

    const handleEditModule = useCallback((row) => {
        setOpenEditModal(true);
        setListId(row.Id);
        setEditData(row.Id)
        setRuntimeCourseModalOpen(true)
    }, [])
    // console.log("hsbbscbsc", openEditModal);
    const runTimeCourseListing = () => {
        setLoading(true)
        getRunTimeCourseList(
            page,
            rowsPerPage
        )
            .then((res) => (
                setRunTimeCourseList(res.result),
                console.log("dbbcbbcc", res.result),
                setLoading(false)
            ))
            .catch((error) => {
                setLoading(false);
                console.log("error is", error);
            })
    }

    useEffect(() => {
        runTimeCourseListing();
    }, [])

    return (
        <div>
            <h1 className="text-[20px] font-semibold text-center">RunTime Course</h1>
            <div className="flex items-center justify-between mt-3">
                <div className="w-[25%]">
                    <SearchBar
                        placeholder="Search"
                        name={"Search"}
                        control={control}
                        label="Search"
                        dataArray={[{
                            id: 1,
                            label: "English"
                        }]}
                        handleInputChange={() => { }}
                        searchIcon={true}
                    />
                </div>
                <button
                    type="button"
                    className="bg-[#073763] flex items-center gap-x-1 text-[14px] p-2 text-white rounded-md shadow transition-all hover:bg-gray-600"
                    onClick={handleOpen}
                >
                    <AddCircleOutlineIcon fontSize="small" />
                    Add New
                </button>
            </div>
            {/* --------------------- runTimeCourse Listing Table ---------------------- */}
            <div className={'mt-5'}>
                {loading ? (
                    <CommonLoader />
                ) : runTimeCourseList && runTimeCourseList.length > 0 ? (
                    <CommonTable
                        dataResult={runTimeCourseList}
                        rowsPerPage={rowsPerPage}
                        renderActions={renderAction}
                        setPage={setPage}
                        tableClass="h-96"
                        count={runTimeCourseList.length}
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
                            "Assessment Type",
                            "Assessment Name"
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

            {runtimeCourseModalOpen && (
                <RunTimeCourseCreateModal
                    runtimeCourseModalOpen={runtimeCourseModalOpen}
                    handleClose={handleClose}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    runTimeCourseListing={runTimeCourseListing}
                    listId={listId}
                    editData={editData}
                    setEditData={setEditData}
                    handleOpen={handleOpen}
                    openEditModal={openEditModal}
                />
            )}
        </div>
    )
}

export default React.memo(RunTimeCourse);