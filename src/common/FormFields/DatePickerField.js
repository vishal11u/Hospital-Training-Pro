import { FormControl, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import { Controller } from "react-hook-form";
function DatePickerField({
  name,
  label,
  control,
  defaultValue,
  disabled,
  disablePast,
  disableFuture,
  sx,
  variant,
  inputProps,
  type,
  inputRef,
  inputFormat,
  error,
  dontCapitalize,
  color,
  onChange,
  minDate,
  value,
  onError,
  slotProps,
  maxDate,
  ...rest
}) {
  // console.log("error",error);
  return (
    <div className="w-full bg-white h-[38px] mt-[1px]">
      <FormControl className="w-full" sx={sx} size="small">
        <Controller
          sx={{ width: "100%" }}
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label={label}
                value={value}
                minDate={minDate}
                onChange={onChange}
                format={inputFormat}
                onBlur={onBlur}
                disabled={disabled}
                disablePast={disablePast}
                disableFuture={disableFuture}
                maxDate={maxDate}
                sx={{
                  "& .css-1q3qg0t-MuiInputBase-root-MuiOutlinedInput-root": {
                    height: "36px",
                    fontSize: 14,
                    width: "100%",
                    borderColor: "#ffffff",
                    overflow: "hidden",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      height: "40px",
                      borderColor: error !== undefined ? "#C84F4E" : "",
                    },
                    "&:hover fieldset": {
                      borderColor: error !== undefined ? "#C84F4E" : "",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: error !== undefined ? "#C84F4E" : "",
                    },
                  },
                  "& .css-1pysi21-MuiFormLabel-root-MuiInputLabel-root": {
                    top: "-2px",
                    color: error !== undefined ? "#C84F4E" : "",
                  },
                  "&.css-1u52y74-MuiFormControl-root-MuiTextField-root ": {
                    borderColor: error !== undefined ? "#C84F4E" : "",
                  },
                  "& .css-4jar7x": {
                    height: "36px",
                  },
                  "& .css-wnl09l-MuiFormLabel-root-MuiInputLabel-root": {
                    top: "-9px",
                    // bottom: '10px'
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    // color:"gray"
                    color: error !== undefined && "#C84F4E",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "14px",
                    color: error !== undefined && "#C84F4E",
                  },
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    height: "0.4375em"
                  },
                  svg: {
                    color: error !== undefined ? "#C84F4E" : "#0B83A5",
                    height: 22,
                    width: "100%",
                    marginRight: "16px",
                  },
                }}
                slotProps={slotProps}
                renderInput={(params) => (
                  <TextField
                    onError={onError}
                    error={error}
                    {...params}
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      style: {
                        fontSize: "14px",
                        position: "absolute",
                        top: "-2px",
                      },
                    }}
                  />
                )}
                {...rest}
              />
            </LocalizationProvider>
          )}
        />
      </FormControl>
    </div>
  );
}

export default DatePickerField;