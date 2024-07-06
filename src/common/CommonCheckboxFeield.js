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
    inputProps,
    value,
    defaultChecked,
    disabled,
    referance,
    onKeyDown,
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
                                checked={!!value}
                                sx={{ "& .MuiSvgIcon-root": checkBoxStyle }}
                                inputProps={inputProps}
                                style={style}
                                defaultChecked={defaultChecked}
                                disabled={disabled}
                                ref={referance} //addedby vp202220
                                onKeyDown={onKeyDown}
                            />
                        );
                    }}
                />
            }
            label={
                <span
                    className="text-sm xl:text-xs 2xl:text-sm whitespace-nowrap"
                    style={style}
                >
                    {label}
                </span>
            }
        />
    );
};

export default CheckBoxField;