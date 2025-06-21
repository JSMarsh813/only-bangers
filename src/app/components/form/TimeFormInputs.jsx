import React from "react";

export default function FormInputs({
  label,
  type,
  inputname,
  inputid,
  defaultValue,
  placeholder,
}) {
  return (
    <label htmlFor={inputid}>
      {label}:
      <input
        type={type}
        className="w-[50] text-center mx-2"
        name={inputname}
        id={inputid}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min="0"
        max="59"
      />
    </label>
  );
}
