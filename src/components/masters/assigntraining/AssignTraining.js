import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, { useEffect, useState } from "react";
import {
  getAssignTrainingList,
} from "../../../services/assigntraining/AssignTraining";
import SearchDropdown from "../../../common/FormFields/searchDropdown";
import CommonDynamicTablePaginationNew from "../../../common/CommonTable/CommonTransactionPaginationTable";
import AssignTrainingModal from "./AssignTrainingModal";
import { useForm } from "react-hook-form";

function Assign_Training() {
  const { reset, control } = useForm();

  const defaultValues = {
    searchByTraningName: '',
    employees: null,
    course: null,
    fromDate: null,
    toDate: null,
  };

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset(defaultValues);
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
          populateAssignTraningListTable={populateAssignTraningListTable}
        />
      )}
    </div>
  );
}

export default Assign_Training;
