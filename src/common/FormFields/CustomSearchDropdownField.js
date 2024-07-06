import React, { useState } from "react";
import Select from "react-select";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchDropdown.css";

const SearchDropdown = ({
  isDisabled,
  isMulti,
  placeholdernotVisible,
  control,
  error,
  name,
  dataArray,
  inputRef,
  placeholder,
  label,
  handleInputChange,
  menuShouldBlockScroll,
  menuPlacement,
  isClearable,
  onChange,
  defaultValue
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleChange = (option) => {
    setSelectedOption(option);
    onChange(option);
  };

  const renderLabel = () => {
    if (selectedOption) {
      return <label className="floating-label">{label}</label>;
    } else {
      return null;
    }
  };
  let isError = !!error?.message;

  const customStyles = {
    menu: (styles) => ({
      ...styles,
      position: "absolute",
      boxShadow: "0 20px 54px 0 rgba(0,0,0,0.2)",
      zIndex: 20,
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "24px"
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
        : undefined
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#888" // Adjust the color to your preference
    }),
    indicatorSeparator: () => ({
      display: "none" // Hide the vertical line
    }),
    control: (Colstyles, state) => ({
      ...Colstyles,
      borderRadius: "5px",
      minHeight: "36.3px",
      fontSize: "14px",
      maxHeight: "36.3px",
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
      whiteSpace: "nowrap"
    })
  };

  return (
    <div className="search-dropdown-container">
      <div className="search-dropdown-wrapper">
        {renderLabel()}
        <Select
          isDisabled={isDisabled}
          isMulti={isMulti}
          placeholder={placeholdernotVisible ? null : placeholder}
          components={{
            DropdownIndicator: () => <SearchIcon />
          }}
          control={control}
          options={dataArray}
          inputRef={inputRef}
          menuShouldBlockScroll={menuShouldBlockScroll}
          menuPlacement={menuPlacement}
          isClearable={isClearable}
          onChange={handleChange}
          defaultValue={defaultValue}
          styles={customStyles}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SearchDropdown;
