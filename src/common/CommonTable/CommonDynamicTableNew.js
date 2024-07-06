import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import { useEffect } from "react";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

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

function CommonDynamicTableNew(props) {
  const {
    dataResult,
    setDataResult, //need to pass only if we want enable SelectAll checkbox functionality
    removeHeaders, //send array of headers which need to remove.  NOTE:send at least one header i.e. id
    tableClass, //required css for tableContainer.i.e. height ,etc.
    renderActions, //render Actions @1st column i.e.icons,checkboxes,etc.
    highlightRow, //default row highlighted,if not want to highlight set as false.
    customRowBgColor, //usefull when required another bg color of selected row than default.
    rowBackgroundColor, //use this to show conditional row bg color .
    handleSelectedRow, //get row onclick use this fn..
    editableColumns, //array of headers to make column editable
    renderInput, //actual content to render i.e. input,dropdown,checkbox,icon,etc
    enableSelectAll, ///to enable select all checkbox funtionality
  } = props;

  const [rowIndex, setRowIndex] = React.useState(-1);

  const [order, setOrder] = React.useState("asc");
  const [upAndDownKey, setUpANdDownKey] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState();

  // const [highlightedRowIndex, setHighlightedRowIndex] = React.useState(-1);

  const createSortHandler = (property) => (event) => {
    handleSortRequest(event, property);
  };

  const handleSortRequest = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const removeHeader = (headers, fieldToRemove) => {
    return headers.filter((v) => {
      return !fieldToRemove.includes(v);
    });
  };

  const allHeaders = Object.keys(dataResult[0]);
  const headers = removeHeaders
    ? removeHeader(allHeaders, removeHeaders && removeHeaders)
    : allHeaders;
  ///
  //////

  const handleSelectAll = () => {
    const allChecked = dataResult.every((row) => row.isChecked);
    console.log(allChecked);

    // Toggle isChecked for all rows
    const updatedDataResult = dataResult.map((row) => ({
      ...row,
      isChecked: !allChecked,
    }));

    setDataResult(updatedDataResult);
  };

  const handleRowSelect = (index) => {
    const updatedDataResult = [...dataResult];
    updatedDataResult[index] = {
      ...updatedDataResult[index],
      isChecked: !updatedDataResult[index].isChecked,
    };

    setDataResult(updatedDataResult);
  };
  //////

  const handleKeyDown = (event) => {
    if (
      (highlightRow === undefined || highlightRow === true) &&
      rowIndex >= 0 &&
      upAndDownKey === true
    ) {
      if (event.key === "ArrowUp" && rowIndex > 0) {
        setRowIndex(rowIndex - 1);
      } else if (
        event.key === "ArrowDown" &&
        rowIndex < dataResult.length - 1
      ) {
        setRowIndex(rowIndex + 1);
      }
    }
  };

  React.useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest(".MuiTableContainer-root")) {
        setUpANdDownKey(false);
      } else {
        setUpANdDownKey(true);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [rowIndex, upAndDownKey]);

  useEffect(() => {
    if (rowIndex !== -1) {
      setRowIndex(-1);
    }
  }, [dataResult]);

  return (
    <>
      <div className="grid w-auto border rounded my-2">
        <Box sx={{ width: "100%", overflow: "hidden" }} className="">
          {/* <Paper sx={{ width: "100%", mb: 1 }}> */}
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
              <Table
                size="small"
                stickyHeader
                aria-label="sticky table"
                sx={{
                  paddingY: "scroll",
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        paddingY: 0.5,
                        backgroundColor: "#F1F1F1",
                      },
                    }}
                  >
                    {enableSelectAll && (
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={dataResult.every((row) => row.isChecked)}
                          onChange={handleSelectAll}
                          style={{ padding: 0 }}
                        />
                      </TableCell>
                    )}
                    {renderActions && (
                      <TableCell
                        className={`whitespace-nowrap ${"sticky left-0 z-1000 bg-white"}`}
                      >
                        <span className="text-gray-600 font-semibold whitespace-nowrap">
                          Actions
                        </span>
                      </TableCell>
                    )}
                    {headers.map((header, index) => {
                      return (
                        <TableCell
                          sortDirection={orderBy === header ? order : false}
                          className="whitespace-nowrap"
                        >
                          <TableSortLabel
                            active={false}
                            direction={orderBy === header ? order : "asc"}
                            onClick={createSortHandler(header)}
                            key={index}
                          >
                            <span className="text-gray-600 text-xs font-semibold">
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
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableSort(dataResult, getComparator(order, orderBy)).map(
                    (row, index) => {
                      return (
                        <TableRow
                          key={index}
                          hover={false}
                          style={{
                            backgroundColor:
                              (highlightRow === undefined ||
                                highlightRow === true) &&
                              rowIndex === index
                                ? customRowBgColor || "#FFC44B"
                                : rowBackgroundColor
                                ? rowBackgroundColor(row, index)
                                : "",
                          }}
                          sx={{
                            "& td": renderActions
                              ? {
                                  paddingY: 0.1,
                                }
                              : { paddingY: 0.5 },
                          }}
                          onClick={() => {
                            setRowIndex(index);
                            handleSelectedRow && handleSelectedRow(row, index);
                          }}
                        >
                          {enableSelectAll && (
                            <TableCell>
                              <Checkbox
                                size="small"
                                checked={row.isChecked ? true : false}
                                onChange={() => handleRowSelect(index)}
                                style={{ padding: 0 }}
                              />
                            </TableCell>
                          )}
                          {renderActions && (
                            <TableCell>{renderActions(row, index)}</TableCell>
                          )}
                          {headers &&
                            headers.map((header, i) => (
                              <TableCell
                                className="whitespace-nowrap"
                                key={i}
                                onClick={() => {
                                  //  displayView(row, index);
                                }}
                              >
                                {editableColumns &&
                                editableColumns.includes(header)
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
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          {/* </Paper> */}
        </Box>
      </div>
    </>
  );
}
export default React.memo(CommonDynamicTableNew);
