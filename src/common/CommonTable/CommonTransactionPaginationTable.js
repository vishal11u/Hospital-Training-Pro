import * as React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { Box } from "@mui/material";
import LoadingSpinner from "../loadingspinner/loadingSpinner";
import { useEffect } from "react";

//set descending sort order
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

//set sort desc
const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const tableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export default function CommonTransactionPaginationTable(props) {
  console.log("props inside CommonDynamicTablePagination is ", props);
  const {
    dataResult,
    page,
    setPage,
    tableClass, //required css for tableContainer.i.e. height ,etc.
    rowsPerPage,
    count,
    renderActions, //render Actions @1st column i.e.icons,checkboxes,etc.
    removeHeaders, //send array of headers which need to remove.  NOTE:send at least one header i.e. id
    handleSelectedRow, //get row onclick use this fn..
    highlightRow, //default row highlighted,if not want to highlight set as false.
    customRowBgColor, //usefull when required another bg color of selected row than default.
    rowBackgroundColor, //use this to show conditional row bg color .
    editableColumns, //array of headers to make column editable
    renderInput, //actual content to render i.e. input,dropdown,checkbox,icon,etc
    populateTable,
    SelectCheckbox,
    toggleSelectedRow,
    //to get data.
  } = props;
  console.log("props", props);

  //state varibale for the table
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState();
  const [rowIndex, setRowIndex] = React.useState(null);
  //
  const [isLoading, setIsLoading] = React.useState(false);
  const [pagesPassed, setPagesPassed] = React.useState(0);
  const [newPageVal, setNewPageVal] = React.useState(null);

  //by default asc order
  const handleSortRequest = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const createSortHandler = (property) => (event) => {
    handleSortRequest(event, property);
  };
  const removeHeader = (headers, fieldToRemove) => {
    return headers.filter((v) => {
      return !fieldToRemove.includes(v);
    });
  };

  //set rows object to table
  const allHeaders = Object.keys(dataResult[0]);

  const headers = removeHeaders
    ? removeHeader(allHeaders, removeHeaders && removeHeaders)
    : allHeaders;

  ///////
  const handlePageChange = (event, newPage) => {
    setRowIndex();

    console.log("handlePageChange", newPage, page);
    setNewPageVal(newPage);
    if (newPage > page) {
      setPage(newPage);
    } else if (newPage < page) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    console.log("newPageVal", newPageVal);
    if (newPageVal > pagesPassed) {
      setPagesPassed(newPageVal);
      setIsLoading(true);
      populateTable(true);
    }
  }, [newPageVal]);

  useEffect(() => {
    if (count <= rowsPerPage || dataResult?.length <= rowsPerPage) {
      setPagesPassed(0);
      setNewPageVal(0);
    }
  }, [count, rowsPerPage, dataResult]);

  console.log("rowIndex", rowIndex);

  return (
    <div className="w-auto grid">
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <Paper sx={{ width: "100%", my: 2, border: "1px solid lightgray" }}>
          {/* pagination */}
          <div className=" flex justify-between items-center">
            <h2 className="font-semibold text-sm pl-2 text-customBlue">
              {props?.tableHeading}
            </h2>
            <TablePagination
              labelRowsPerPage=""
              rowsPerPageOptions={[]}
              sx={{
                ".MuiTablePagination-toolbar": {
                  minHeight: "35px",
                },
              }}
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              SelectProps={{
                disabled: isLoading,
              }}
              backIconButtonProps={
                isLoading
                  ? {
                    disabled: isLoading,
                  }
                  : undefined
              }
              nextIconButtonProps={
                isLoading
                  ? {
                    disabled: isLoading,
                  }
                  : undefined
              }
            />
          </div>
          <TableContainer
            sx={{
              "&::-webkit-scrollbar": {
                width: 7,
                height: 10,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#ebebeb",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#7393b3",
                borderRadius: 4,
              },
            }}
            className={tableClass}
          >
            <Table size="small" stickyHeader>
              <TableHead >
                <TableRow
                  sx={{
                    "& th": {
                      backgroundColor: "#F1F1F1",
                    },
                  }}
                >
                  {renderActions && (
                    <TableCell>
                      <span className="text-gray-600 font-semibold whitespace-nowrap">
                        Actions
                      </span>
                    </TableCell>
                  )}

                  {/* heading of table */}
                  {headers.map((header, index) => (
                    <TableCell
                      sortDirection={orderBy === header ? order : false}
                      className="whitespace-nowrap"
                      key={index}
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === header ? order : "asc"}
                        onClick={createSortHandler(header)}
                      >
                        <span className="text-gray-600 font-semibold">
                          {header}
                        </span>
                        {orderBy === header ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {(page > 0 || dataResult.length > rowsPerPage
                  ? tableSort(dataResult, getComparator(order, orderBy)).slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  : tableSort(dataResult, getComparator(order, orderBy))
                ).map((row, index) => {
                  isLoading && setIsLoading(false);
                  const rowKey = page > 0 ? page * rowsPerPage + index : index;
                  return (
                    <TableRow
                      hover
                      key={rowKey}
                      onClick={() => {
                        toggleSelectedRow
                          ? rowIndex === index
                            ? setRowIndex(null)
                            : setRowIndex(index)
                          : setRowIndex(index);
                        {
                          handleSelectedRow && handleSelectedRow(row, index);
                        }
                      }}
                      style={{
                        backgroundColor:
                          (highlightRow === undefined ||
                            highlightRow === true) &&
                            rowIndex === index
                            ? customRowBgColor || "#FFC44B"
                            : rowBackgroundColor
                              ? rowBackgroundColor(row, index)
                              : "#FFFFFF",
                      }}
                    >
                      {renderActions && (
                        <TableCell>{renderActions(row, index)}</TableCell>
                      )}
                      {headers &&
                        headers.map((header, i) => (
                          <TableCell
                            className="whitespace-nowrap capitalize w-full p-0"
                            key={i}
                            padding={SelectCheckbox === true ? "checkbox" : ""}
                          >
                            {editableColumns && editableColumns.includes(header)
                              ? renderInput(row, index, header)
                              : row[header] === true
                                ? "Yes"
                                : row[header] === false
                                  ? "No"
                                  : row[header]}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {isLoading && (
              <div className="flex justify-center text-gray-400 font-semibold my-5">
                <LoadingSpinner />
              </div>
            )}
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
}
