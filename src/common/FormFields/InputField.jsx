import { FormControl, TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
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
  InputLabelProps
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
            InputProps={{
              disabled: disabled,
            }}
            InputLabelProps={InputLabelProps}
            inputProps={
              dontCapitalize
                ? (inputProps,
                  {
                    style: {
                      fontSize: "14px",
                      height: "18.5px",
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
                  }
                : {
                    "& .MuiFormLabel-root": {
                      fontSize: "14px",
                      position: "absolute",
                      top: "-2px",
                    },
                    fontSize: "14px",
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
          />
        )}
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
    </FormControl>
  );
};

export default InputField;
