import React from "react";
import toast from "react-hot-toast";
import ToasterProvider from "./Toast";

const TestToaster = () => {
  const showToast = () => {
    toast.success("This is a success message!");
  };

  const showToastFail = () => {
    toast.error("This is an error message!");
  };

  return (
    <div>
      <button onClick={showToast}>Show Success Toast</button>
      <button onClick={showToastFail}>Show Error Toast</button>
    </div>
  );
};

export default TestToaster;
