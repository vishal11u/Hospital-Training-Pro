import React from "react";
import { FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
// import "./style.css";
import { IoSearch } from "react-icons/io5";
const InputField = ({
    sx,
    ref,
    focused,
    variant,
    defaultValue,
    inputProps,
    type,
    disabled,
    inputRef,
    name,
    label,
    error,
    onKeyDown,
    control,
    dontCapitalize,
    color,
    shrink,
    InputProps
}) => {
    return (
        <FormControl fullWidth size="small" sx={sx}>
            <Controller
                render={({ field }) => (
                    <TextField
                        className="h-[35px] text-[14px] bg-white"
                        inputRef={inputRef}
                        ref={ref ? ref : null}
                        autoComplete="off"
                        onKeyDown={onKeyDown}
                        inputProps={
                            dontCapitalize
                                ? (inputProps,
                                {
                                    style: {
                                        fontSize: "14px",
                                        height: "20px",
                                    },
                                })
                                : (inputProps,
                                {
                                    style: {
                                        textTransform: "capitalize",
                                        fontSize: "14px",
                                        height: "18.5px",
                                    },
                                })
                        }
                        sx={
                            shrink
                                ? {
                                    "& .MuiFormLabel-root": {
                                        fontSize: "14px",
                                    },
                                    "& .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root ": {
                                        borderRadius: "8px"
                                    }
                                }
                                : {
                                    "& .MuiFormLabel-root": {
                                        fontSize: "14px",
                                        position: "absolute",
                                        top: "-2px",
                                    },
                                    fontSize: "14px",
                                    "& .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root ": {
                                        borderRadius: "8px"
                                    }
                                }
                        }
                        autoFocus={focused ? true : false}
                        onWheel={(e) => {
                            if (type == "number") {
                                e.target.blur();
                            }
                        }}
                        type={type}
                        disabled={disabled}
                        error={!!error?.message}
                        color={color}
                        variant={variant}
                        label={label}
                        placeholder={label}
                        name={name}
                        fullWidth
                        {...field}
                        size="small"
                        shrink={false}
                        // InputProps={{
                        //     endAdornment: (
                        //         <InputAdornment position="start">
                        //             <IoSearch size={19} color='' />
                        //         </InputAdornment>
                        //     ),
                        // }}
                    />
                )}
                name={name}
                control={control}
                defaultValue={defaultValue}
            />
            {/* <FormHelperText style={{ color: "#d32f2f" }}>
        {error?.message}
      </FormHelperText> */}
        </FormControl>
    );
};

export default InputField;