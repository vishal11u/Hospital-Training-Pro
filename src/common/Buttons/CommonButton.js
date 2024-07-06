import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import AddIcon from '@mui/icons-material/Add';

const CommonButton = ({
  type,
  onClick,
  label,
  className,
  disabled,
  searchIcon,
  cancelIcon,
  icon,
  addIcon
}) => {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      disabled={disabled}
      className={
        !disabled
          ? `h-9 px-3 w-max rounded flex items-center space-x-2 shadow align-bottom  text-sm font-medium ${className}`
          : `h-9 px-3 w-max rounded text-sm flex items-center align-bottom shadow space-x-2 font-medium bg-gray-400  text-white`
      }
    >
      {searchIcon && <SearchIcon className="cursor-pointer" />}
      {cancelIcon && <CancelPresentationIcon className="cursor-pointer" />}
      {addIcon && <AddIcon className="cursor-pointer" />}
      {icon} &nbsp;
      {label}
    </button>
  );
};

export default CommonButton;
