import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import React from "react";

import { Controller } from "react-hook-form";
// space-x-2
const RadioField = ({ dataArray, name, label, control, error, defaultValue, disabled, onChange }) => {
    return (
        <FormControl className="">
            <div className="flex ">
                <FormLabel
                    sx={{ color: "#000000", fontSize: "12px" }}
                    id="demo-radio-buttons-group-label"
                >
                    {label}
                </FormLabel>
                <Controller
                    render={({ field }) => (
                        <RadioGroup
                            row
                            className="flex whitespace-nowrap space-x-1"
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue={defaultValue}
                            name={name}
                            {...field}
                            sx={{
                                marginTop: "-0.3rem",
                                display: "flex",
                                whiteSpace: "nowrap",
                                flexWrap: "nowrap",
                                // justifyContent: "space-between",
                            }}
                        >
                            {dataArray.map((p) => (
                                <FormControlLabel
                                    className="-space-x-1"
                                    key={name + p.id}
                                    value={p.id}
                                    control={
                                        <Radio
                                            size="small -ml-2.5"
                                            disabled={disabled}
                                            onChange={onChange}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2 " className={`w-full flex text-sm xl:tex-base ${error?.message ? 'text-red-500' : ''}`}>
                                            {p.label}
                                        </Typography>
                                    }
                                />
                            ))}
                        </RadioGroup>
                    )}
                    name={name}
                    control={control}
                    defaultValue={""}
                />
            </div>
        </FormControl>
    );
};

export default RadioField;