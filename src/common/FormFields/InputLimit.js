import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const InputLimit = ({
  control,
  name,
  label,
  required,
  maxDigits,
  sx,
  variant,
  defaultValue,
  inputProps,
  type,
  disabled,
  inputRef,
  error,
  dontCapitalize,
  color,
  onKeyDown,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <TextField
            inputMode="numeric"
            pattern="[0-9]*"
            inputProps={{
              maxLength: maxDigits,
              style: { 
                textTransform: "capitalize",
                fontSize: "14px",
                height: "18.5px",
              },
            }}
            value={value || ""}
            onChange={(event) => {
              if (event.target.value.length <= maxDigits) {
                onChange(event);
              }
            }}
            error={!!error?.message}
            className="h-[36px] text-[14px] bg-white"
            inputRef={inputRef}
            ref={null}
            onKeyDown={onKeyDown}
            sx={{
              "& .MuiFormLabel-root": {
                fontSize: "14px",
              },
            }}
            onWheel={(e) => {
              if (type == "number") {
                e.target.blur();
              }
            }}
            type={type}
            disabled={disabled}
            color={color}
            variant={variant}
            label={label}
            placeholder={label}
            name={name}
            fullWidth
            size="small"
          />
        );
      }}
    />
  );
};
export default InputLimit;
