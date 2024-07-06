import React, { useState } from 'react'
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
import { Box, Tooltip } from "@mui/material";
// import LoadingSpinner from "../loadingspinner/loadingSpinner";
import { padding } from "@mui/system";
import { Checkbox } from '@mui/material';

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

export default function CommonTable(props) {
    // console.log("props inside CommonDynamicTablePagination is ", props);
    const {
        dataResult, //taking an object
        page,
        setPage,
        tableClass, //required css for tableContainer.i.e. height ,etc.
        rowsPerPage, //set a row display on perpage
        setRowsPerPage,
        count,
        renderActions, //render Actions @1st column i.e.icons,checkboxes,etc.
        removeHeaders, //send array of headers which need to remove.  NOTE:send at least one header i.e. id
        handleSelectedRow, //get row onclick use this fn..
        highlightRow, //default row highlighted,if not want to highlight set as false.
        customRowBgColor, //usefull when required another bg color of selected row than default.
        rowBackgroundColor, //use this to show conditional row bg color .
        editableColumns, //array of headers to make column editable
        renderInput, //actual content to render i.e. input,dropdown,checkbox,icon,etc
        populateTable, //to get data.
        SelectCheckbox, // for checkbox padding adjust
    } = props;

    console.log("data result", dataResult);

    //state varibale for the table
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState();
    const [rowIndex, setRowIndex] = useState();
    //
    const [isLoading, setIsLoading] = useState(false);
    const [pagesPassed, setPagesPassed] = useState(0);
    const [newPageVal, setNewPageVal] = useState(null);

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
        console.log("handlePageChange", newPage, page);
        setNewPageVal(newPage);
        if (newPage > page) {
            setPage(newPage);
        } else if (newPage < page) {
            setPage(newPage);
        }
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    React.useEffect(() => {
        console.log("newPageVal", newPageVal);
        if (newPageVal > pagesPassed) {
            setPagesPassed(newPageVal);
            setIsLoading(true);
            populateTable(true);
        }
    }, [newPageVal]);

    return (
        <div className="w-full grid mt-2">
            <Box sx={{ width: "100%", boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', overflow: "hidden", borderRadius: '5px' }}>
                <Paper sx={{ width: "100%", py: '2px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;' }}>
                    {/* pagination */}
                    <TablePagination
                        labelRowsPerPage=""
                        rowsPerPageOptions={[5, 10, 15]}
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
                        onRowsPerPageChange={handleChangeRowsPerPage}
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
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-sm pl-2 text-customBlue">
                            {props?.tableHeading}
                        </div>
                    </div>
                    <TableContainer
                        sx={{
                            "&::-webkit-scrollbar": {
                                width: 7,
                                height: 7,
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#ebebeb",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#BAE6FD",
                                borderRadius: 4,
                            },
                            overflowY: "auto"
                        }}
                        className={tableClass}
                    >
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        "& th": {
                                            paddingY: 0.5,
                                            backgroundColor: "#6B7280",
                                            color: 'white',
                                        },
                                    }}
                                >
                                    {renderActions && (
                                        <TableCell>
                                            <span className="text-white font-bold whitespace-nowrap">
                                                Actions
                                            </span>
                                        </TableCell>
                                    )}
                                    {/* heading of table */}
                                    {headers.map((header, index) => (
                                        <TableCell
                                            sortDirection={orderBy === header ? order : false}
                                            className="whitespace-nowrap capitalize"
                                            key={index}
                                        >
                                            <TableSortLabel
                                                active={false} //arrow for sorting
                                                direction={orderBy === header ? order : "asc"}
                                                onClick={createSortHandler(header)}
                                            >
                                                <span className="text-white mx-auto font-semibold ">
                                                    {header}
                                                </span>
                                                {orderBy === header ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === "desc"
                                                            ? "sorted descending "
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
                                            key={rowKey}
                                            onClick={() => {
                                                setRowIndex(index);
                                                {
                                                    handleSelectedRow && handleSelectedRow(row, index);
                                                }
                                            }}
                                            sx={{
                                                "& td": {
                                                    paddingY: 0.6,
                                                    paddingX: 1,
                                                    // textAlign: 'center',
                                                    // borderRight:1
                                                },
                                            }}
                                            style={{
                                                backgroundColor:
                                                    (highlightRow === undefined ||
                                                        highlightRow === true) &&
                                                        rowIndex === index
                                                        ? customRowBgColor || "" //selected row color
                                                        : rowBackgroundColor
                                                            ? rowBackgroundColor(row, index)
                                                            : "",
                                            }}
                                        >
                                            {renderActions && (
                                                <TableCell  >{renderActions(row, index)}</TableCell>
                                            )}
                                            {headers &&
                                                headers.map((header, i) => (
                                                    <TableCell
                                                        className="whitespace-nowrap capitalize  "
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
                        {/* {isLoading && (
              <div className="flex justify-center text-gray-400 font-semibold my-5">
                <LoadingSpinner />
              </div>
            )} */}

                    </TableContainer>
                </Paper>
            </Box>
        </div>
    );
}

// const renderActions = (row, rowIndex) => {
//   console.log("row, rowIndex", row, rowIndex);
//   return (
//     <>
//       <div className="gap-2 flex  items-center">
//         {row.Status === "Authorised" ? (
//           <Tooltip title="Print" arrow>
//             <button
//               type="button"
//               onClick={() => {
//                 openPrintWindow(row.patientVisitId);
//               }}
//             >
//               <PrintIcon />
//             </button>
//           </Tooltip>
//         ) : (
//           <Tooltip title="Print" arrow>
//             <button
//               type="button"
//               onClick={() => {
//                 openPrintWindow(row.patientVisitId);
//               }}
//             >
//               <PrintDisableIcon />
//             </button>
//           </Tooltip>
//         )}
//         <Tooltip title="BarCode" arrow>
//           <button
//             type="button"
//             onClick={() => {
//               openPrintWindow(row.patientVisitId);
//             }}
//           >
//             <BarCodeIcon />
//           </button>
//         </Tooltip>
//       </div>
//     </>
//   );
// };