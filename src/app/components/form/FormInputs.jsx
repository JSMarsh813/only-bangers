import React from "react";

export default function FormInputs({
  label,
  type,
  inputname,
  inputid,
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
        placeholder={placeholder}
      />
    </label>
  );
}
