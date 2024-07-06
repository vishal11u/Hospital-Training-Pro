import SearchIcon from "@mui/icons-material/Search";
import React, { useRef, useState } from "react";
import ReactSelect from "react-select";

const SearchBar = ({
  searchIcon,
  clearSearchBar,
  dataArray,
  onChange,
  inputRef,
  placeholder,
  isClearable,
  label,
  handleInputChange,
  disabled
}) => {
  const [inputValue, setInputValue] = useState("");
  const selectInputRef = useRef();
  
  const selectStyles = {
    menu: (styles) => ({
      ...styles,
      position: "absolute",
      minWidth: "100%",
      boxShadow: "0 20px 54px 0 rgba(0,0,0,0.2)",
      zIndex: 20,
      margin: 0,
      fontSize: "14px",
    }),
    control: (Colstyles, state) => ({
      ...Colstyles,
      borderRadius: "5px",
      minHeight: "2.25rem",
      overflow: "clipped",
      whiteSpace: "nowrap",
      flexWrap: "nowrap",
      margin: 0,
      fontSize: "14px",
      minWidth: "100%",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: 0,
      fontSize: "14px",
      overflow: "clip",
    }),
  };
  if (isClearable !== false) {
    isClearable = true;
  }

  const handleOnChange = (e) => {
    setInputValue("");
    onChange(e);
    if (clearSearchBar) {
      selectInputRef.current.select.clearValue();
    }
  };

  const handleInputChangeFunc = (string, action) => {
    if (action.action !== "input-blur" && action.action !== "menu-close") {
      console.log(string);
      handleInputChange(string);
      setInputValue(string);
    }
  };
  return (
    <div className=" w-full">
      <ReactSelect
        inputValue={inputValue}
        ref={selectInputRef}
        options={dataArray}
        placeholder={placeholder}
        openMenuOnClick={false}
        isClearable={isClearable}
        isDisabled={disabled}
        inputRef={inputRef}
        clearValue={true}
        styles={selectStyles}
        components={{
          DropdownIndicator: () =>
            searchIcon ? (
              <SearchIcon className=" mr-2 text-slate-500 " />
            ) : null,
          IndicatorSeparator: () => null,
        }}
        onInputChange={handleInputChangeFunc.bind(this)}
        onChange={handleOnChange}
        blurInputOnSelect
        controlShouldRenderValue={!clearSearchBar}
      />
    </div>
  );
};
export default SearchBar;