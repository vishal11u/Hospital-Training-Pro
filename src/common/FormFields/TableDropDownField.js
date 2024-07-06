import React, { useLayoutEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { FormControl, FormHelperText } from "@mui/material";
import ReactSelect, { components } from "react-select";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
const TableDropDownField = ({
  className,
  isDisabled,
  placeholdernotVisible,
  isMulti,
  inputRef,
  control,
  error,
  dataArray,
  name,
  handleInputChange,
  placeholder,
  isClearable,
  defaultValue,
  searchIcon,
  isSearchable,
  menuPlacement,
  menuShouldBlockScroll,
}) => {
  const ref = useRef(null);
  const [width, setWidth] = useState("full");
  const [fullwidth, setFullWidth] = useState(0);
  const placeHolderPositionTop = useRef(null);
  const [placeHolderTop, setPlaceHolderTop] = useState(false);

  React.useEffect(() => {
    placeHolderPositionTop.current = placeHolderTop;
  }, [placeHolderTop]);

  // dummyChanges
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
    setFullWidth(ref.current.offsetWidth);
  }, []);
  if (isSearchable !== true) {
    isSearchable = false;
  }
  let isError = !!error?.message;
  let bgColor = "rgba(255, 255, 255, 1)";

  const selectStyles = {
    menu: (styles) => ({
      ...styles,
      position: "absolute",
      boxShadow: "0 20px 54px 0 rgba(0,0,0,0.2)",
      zIndex: 50,
      fontStyle: "normal",
      fontSize: "12px",
      lineHeight: "16px",
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
      minHeight: "20px",
      maxHeight: "25px",
      width: "160px",
      borderColor: "#0B83A5",
      maxWidth: "180px",
      textOverflow: "ellipsis",
      display: "flex",
      flexWrap: isMulti ? "wrap" : "nowrap",
      border: isError
        ? state.isSelected
          ? "1px solid #0B83A5"
          : state.isFocused
          ? "1px solid #0B83A5"
          : state.hasValue || state.selectProps.inputValue
          ? "1px solid #d32f2f"
          : "1px solid #d32f2f"
        : state.hasValue || state.selectProps.inputValue
        ? ""
        : "",
    }),
    singleValue: (Singstyles) => ({
      ...Singstyles,
      // border:'2px solid black',
      display: "flex",
      // width:'2px',
      fontSize: "10px",
      maxWidth: "120px",
      textOverflow: "clipped",
    }),
    indicatorSeparator: (styles) => ({ display: "none", paddingX: "2px" }),

    valueContainer: (provided, state) => ({
      ...provided,
      position: "relative",
      width: "120px",
      maxWidth: "120px",
      whiteSpace: "nowrap",
      overflow: "visible",
      borderColor: "#0B83A5",
      display: "flex",
      flexWrap: isMulti ? "wrap" : "nowrap",
      maxHeight: "fit-content",
      fontSize: "12px",
      textOverflow: "clipped",
      paddingLeft: state.hasValue || state.selectProps.inputValue ? 3 : 3,
      fontStyle: "normal",
    }),
    input: (provided, state) => ({
      ...provided,
      fontSize: "10px",
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
          : "none"
        : "none",
      position: "absolute",
      // display: "none",
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
        10,
      transition: "top 0.1s, font-size 0.1s",

      top:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? isSearchable
            ? -16
            : -10
          : isSearchable
          ? 4
          : "7%",

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

      // marginTop: state.menuIsOpen || state.selectProps.menuIsOpen || state.hasValue || state.selectProps.inputValue ? 4: "",

      marginBottom:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 4
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
              className={
                className +
                "text-sm w-[160px] border-customBlue lg:text-base text-gray-600"
              }
              isDisabled={isDisabled}
              inputRef={inputRef}
              {...field}
              ref={null}
              isMulti={isMulti}
              closeMenuOnSelect={isMulti ? false : true}
              options={dataArray}
              isClearable={isClearable}
              clearValue={true}
              isSearchable={isSearchable}
              placeholder={placeholder}
              defaultValue={defaultValue}
              // openMenuOnClick={false}
              styles={selectStyles}
              blurInputOnSelect={true}
              menuPlacement={menuPlacement}
              menuShouldBlockScroll={menuShouldBlockScroll}
              components={{
                DropdownIndicator: () =>
                  isMulti ? (
                    <KeyboardArrowDownIcon className="mx-2 text-gray-600" />
                  ) : searchIcon ? (
                    <SearchIcon className="mx-2 text-gray-600" />
                  ) : (
                    <KeyboardArrowDownIcon className="mx-2 text-gray-600" />
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

export default TableDropDownField;
