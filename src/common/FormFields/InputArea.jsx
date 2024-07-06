import { TextareaAutosize } from "@mui/base";
import Textarea from "@mui/joy/Textarea";
import { styled } from "@mui/joy/styles";
import React from "react";
import { Controller } from "react-hook-form";
//
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
  THEME_ID as MATERIAL_THEME_ID,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  experimental_extendTheme as materialExtendTheme,
} from "@mui/material/styles";

const materialTheme = materialExtendTheme();

const StyledTextarea = styled(TextareaAutosize)({
  resize: "none",
  border: "none",
  minWidth: 0,
  outline: 0,
  padding: 0,
  paddingBlockStart: "1em",
  paddingInlineEnd: `var(--Textarea-paddingInline)`,
  flex: "auto",
  alignSelf: "stretch",
  color: "inherit",
  backgroundColor: "transparent",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontStyle: "inherit",
  fontWeight: "inherit",
  lineHeight: "inherit",
  overflowY: "auto",
  "&::placeholder": {
    opacity: 0,
    transition: "0.1s ease-out",
  },
  "&:focus::placeholder": {
    opacity: 1,
  },
  "&:focus + textarea + label, &:not(:placeholder-shown) + textarea + label": {
    top: "0.5rem",
    fontSize: "0.75rem",
  },
  "&:focus + textarea + label": {
    color: "var(--Textarea-focusedHighlight)",
  },
});

const StyledLabel = styled("label")(({ theme }) => ({
  position: "absolute",
  lineHeight: 1,
  top: "calc((var(--Textarea-minHeight) - 1em) / 2)",
  color: theme.vars.palette.text.tertiary,
  fontWeight: theme.vars.fontWeight.md,
  transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
}));

export default function InputArea({
  name,
  label,
  placeholder,
  defaultValue,
  control,
  minRows,
  maxRows,
  disable,
  error,
  ...props
}) {
  const InnerTextarea = React.forwardRef(function InnerTextarea(
    { name, label, placeholder, defaultValue, ...props },
    ref
  ) {
    const id = React.useId();

    return (
      <React.Fragment>
        <StyledTextarea
          {...props}
          {...{ name, id }}
          ref={ref}
          placeholder={placeholder}
          minRows={minRows}
          maxRows={maxRows}
        />
        <StyledLabel htmlFor={id}>{label}</StyledLabel>
      </React.Fragment>
    );
  });
  return (
    <MaterialCssVarsProvider
      theme={{
        [MATERIAL_THEME_ID]: materialTheme,
      }}
    >
      <JoyCssVarsProvider>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          disable={disable}
          render={({ field }) => (
            <Textarea
              slots={{ textarea: InnerTextarea }}
              slotProps={{
                textarea: { ...field, placeholder, name, label, defaultValue },
              }}
              error={error}
              // style={{overflowY:"auto"}}
              sx={{
                borderRadius: "6px",
                backgroundColor: "white",
              }}
              {...props}
              minRows={minRows}
            />
          )}
        />
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
