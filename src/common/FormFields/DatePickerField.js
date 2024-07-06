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

  ...rest
}) {
  return (
    <div className="w-full">
      <FormControl className="w-full" sx={sx} size="small">
        <Controller
          sx={{ width: "100%", height: "40px" }}
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {console.log("errorDate", error)}
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
                renderInput={(params) => (
                  <TextField
                    onError={onError}
                    error={error}
                    {...params}
                    size="small"
                    fullWidth
                  />
                )}
                sx={{
                  "& .css-1q3qg0t-MuiInputBase-root-MuiOutlinedInput-root": {
                    height: "36px",
                  },
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    fontSize: " 12px",
                  },
                  "& .css-1ayhp4g-MuiFormLabel-root-MuiInputLabel-root": {
                    fontSize: " 12px",
                    color: error?.type === "required" ? "#DC2626" : "#073763",
                  },
                  "& fieldset": {
                    borderColor: error?.type === "required" ? "#DC2626" : "",
                  },
                  "&:hover fieldset": {
                    borderColor: error?.type === "required" ? "#DC2626" : "",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: error?.type === "required" ? "#DC2626" : "",
                  },
                  "& .css-i4bv87-MuiSvgIcon-root": {
                    fontSize: " 22px",
                    color: error?.type === "required" ? "#DC2626" : "#073763",
                  },
                  "& .css-wnl09l-MuiFormLabel-root-MuiInputLabel-root": {
                    top: value === null ? "-8px" : "",
                    fontSize: 14,
                    color: error?.type === "required" ? "#DC2626" : "",
                  },
                }}
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
