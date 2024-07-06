import React from "react";
export const UseCheckConsecutiveCharacters = (value) => {
  const inputValue = value;
  let hasThreeConsecutive = false;

  if (inputValue.length >= 3) {
    for (let i = 2; i < inputValue.length; i++) {
      if (
        inputValue[i] === inputValue[i - 1] &&
        inputValue[i] === inputValue[i - 2]
      ) {
        hasThreeConsecutive = true;
        break;
      }
    }
  }
  return !hasThreeConsecutive;
};

// ########## if getting searchString as e-->target-->value = searchString  ###########
// const handleChange = (e) => {
//   if (e.target.value !== "" && UseCheckConsecutiveCharacters(e.target.value)) {
//     // Your API Call
//   }
// };

// ##########  if getting searchString as "searchString"  ##########
// const handleChange = (searchString) => {
//   if (searchString !== "" && UseCheckConsecutiveCharacters(searchString)) {
//     // Your API Call
//   }
// };
