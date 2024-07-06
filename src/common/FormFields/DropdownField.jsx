import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl } from "@mui/material";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import ReactSelect, { components } from "react-select";

const DropdownField = ({
  className,
  isDisabled,
  placeholdernotVisible,
  isMulti,
  inputRef,
  control,
  error,
  dataArray,
  name,
  onInputChange,
  placeholder,
  isClearable,
  maxMenuHeight,
  defaultValue,
  searchIcon,
  isSearchable,
  menuPlacement,
  menuShouldBlockScroll,
  referance,
  onKeyDown,
}) => {
  const ref = useRef(null);
  let isError = !!error?.message;
  let bgColor = "rgba(255, 255, 255, 1)";

  const [width, setWidth] = useState("full");

  if (menuPlacement) {
  } else {
    menuPlacement = "auto";
  }
  if (menuShouldBlockScroll !== true) {
    menuShouldBlockScroll = false;
  }

  useLayoutEffect(() => {
    if (isClearable) {
      setWidth(ref.current.offsetWidth - 72);
    } else {
      setWidth(ref.current.offsetWidth - 52);
    }
  }, []);

  if (isSearchable !== true) {
    isSearchable = false;
  }

  const selectStyles = {
    menu: (styles) => ({
      ...styles,
      position: "absolute",
      boxShadow: "0 20px 54px 0 rgba(0,0,0,0.2)",
      zIndex: 50,
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "24px",
      minWidth: ref.current.offsetWidth,
      width: "fit-content",
    }),
    option: (provided, { isDisabled, isFocused, isSelected }) => ({
      ...provided,
      whiteSpace: "nowrap",
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "rgba(222,235,255,1)"
        : isFocused
        ? "rgba(222,235,255,0.5)"
        : undefined,

      color: isDisabled
        ? undefined
        : isSelected
        ? "#000000"
        : isFocused
        ? "#000000"
        : undefined,
    }),
    control: (Colstyles, state) => ({
      ...Colstyles,
      borderRadius: "5px",
      fontSize: "14px",
      minHeight: "36.3px",
      maxHeight: "fit-content",
      textOverflow: "ellipsis",
      display: "flex",
      flexWrap: isMulti ? "wrap" : "nowrap",
      border: isError
        ? state.isSelected
          ? "1px solid #DEEBFF"
          : state.isFocused
          ? "1px solid #DEEBFF"
          : state.hasValue || state.selectProps.inputValue
          ? "1px solid #d32f2f"
          : "1px solid #d32f2f"
        : state.hasValue || state.selectProps.inputValue
        ? ""
        : "",
    }),
    singleValue: (Singstyles) => ({
      ...Singstyles,
      display: "flex",
      paddingLeft: "4px",
      maxWidth: width,
      textOverflow: "clipped",
    }),
    indicatorSeparator: (styles) => ({ display: "none", paddingX: "2px" }),

    valueContainer: (provided, state) => ({
      ...provided,
      position: "relative",
      fontSize: "14px",
      maxWidth: width,
      whiteSpace: "nowrap",
      overflow: "visible",
      display: "flex",
      flexWrap: isMulti ? "wrap" : "nowrap",
      maxHeight: "fit-content",
      textOverflow: "clipped",
      paddingLeft: state.hasValue || state.selectProps.inputValue ? 2 : 5,
      fontStyle: "normal",
    }),
    input: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      overflow: "clip",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      display: placeholdernotVisible
        ? state.menuIsOpen ||
          state.selectProps.menuIsOpen ||
          state.hasValue ||
          state.selectProps.inputValue
          ? "none"
          : "block"
        : "block",

      position: "absolute",
      fontSize: "11px",
      borderRadius: "2px",
      color:
        state.menuIsOpen || state.selectProps.menuIsOpen
          ? isDisabled
            ? "#eaeaea"
            : "#1976D2"
          : isError
          ? "#d32f2f"
          : "#9e9e9e",

      fontSize:
        (state.menuIsOpen ||
          state.selectProps.menuIsOpen ||
          state.hasValue ||
          state.selectProps.inputValue) &&
        11,
      transition: "top 0.1s, font-size 0.1s",

      top:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? isSearchable
            ? -11
            : -11
          : isSearchable
          ? 6
          : "18%",

      paddingLeft:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 4
          : "",

      paddingRight:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 4
          : "",
      marginBottom:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 2
          : "",

      backgroundColor:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? isDisabled
            ? "#f0f0f0"
            : bgColor
          : "",

      zIndex:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 10
          : "",

      fontStyle: "normal",
    }),
  };
  const { ValueContainer, Placeholder } = components;

  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, (child) =>
          child && child.type !== Placeholder ? child : null
        )}
      </ValueContainer>
    );
  };
  return (
    <div className=" w-full" ref={ref}>
      <FormControl fullWidth sx={{ overFlowX: "hidden" }}>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field }) => (
            <ReactSelect
              className={className + "text-[14px] text-gray-600 w-full"}
              isDisabled={isDisabled}
              inputRef={inputRef}
              {...field}
              ref={referance}
              onKeyDown={onKeyDown}
              isMulti={isMulti}
              closeMenuOnSelect={isMulti ? false : true}
              maxMenuHeight={maxMenuHeight}
              options={dataArray}
              isClearable={isClearable}
              clearValue={true}
              isSearchable={true}
              placeholder={placeholder}
              defaultValue={defaultValue}
              styles={selectStyles}
              blurInputOnSelect={true}
              menuPlacement={menuPlacement}
              menuShouldBlockScroll={menuShouldBlockScroll}
              onInputChange={onInputChange}
              components={{
                DropdownIndicator: () =>
                  isMulti ? (
                    <KeyboardArrowDownIcon className="mx-1 text-gray-600" />
                  ) : searchIcon ? (
                    <SearchIcon className="mx-1 text-gray-600" />
                  ) : (
                    <KeyboardArrowDownIcon className="mx-1 text-gray-600" />
                  ),
                ValueContainer: CustomValueContainer,
              }}
            />
          )}
        />
      </FormControl>
    </div>
  );
};

export default DropdownField;
