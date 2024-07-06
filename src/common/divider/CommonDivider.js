import React from "react";
import { Divider as MuiDivider } from "@mui/material";

const CommonDivider = ({
  color = "#073763",
  height = 1,
  width=100,
  orientation,
  ...props
}) => {
  return (
    <div className="my-1">
      <MuiDivider
        sx={{
          backgroundColor: color,
          height: `${height}px`,
          width: `${width}%`,
        }}
        orientation={orientation?"vertical":"horizontal"}
        {...props}
      />
    </div>
  );
};

export default CommonDivider;
