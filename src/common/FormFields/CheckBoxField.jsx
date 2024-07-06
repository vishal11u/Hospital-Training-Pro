import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

import { Controller } from "react-hook-form";
const CheckBoxField = ({
  name,
  label,
  control,
  defaultValue,
  style,
  checkBoxStyle,
  className,
  disabled,
  sx,
}) => {
  return (
    <FormControlLabel
      control={
        <Controller
          defaultValue={defaultValue}
          name={name}
          control={control}
          render={({ field: { value = false, ...field } }) => {
            return (
              <Checkbox
                size="small"
                {...field}
                disabled={disabled}
                checked={!!value}
                sx={{ ...sx, "& .MuiSvgIcon-root": checkBoxStyle }}
              />
            );
          }}
        />
      }
      label={
        <span className={`text-sm ${className}`} style={style}>
          {label}
        </span>
      }
    />
  );
};

export default CheckBoxField;
