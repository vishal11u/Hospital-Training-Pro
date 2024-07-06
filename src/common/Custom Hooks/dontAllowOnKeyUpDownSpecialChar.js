import React from "react";

export default function dontAllowOnKeyUpDownSpecialChar(e) {
  if (
    e?.key === "e" ||
    e?.key === "-" ||
    e?.key === "." ||
    e?.key === "+" ||
    e?.key === "Enter" ||
    e?.code === "ArrowUp" ||
    e?.code === "ArrowDown" ||
    e?.code === "NumpadDecimal"
  ) {
    e.preventDefault();
  }
}
