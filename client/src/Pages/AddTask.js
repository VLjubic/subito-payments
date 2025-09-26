import React, { useEffect, useState } from "react";
import TaskForm from "../Components/TaskForm";
import { useLocation, useNavigate } from "react-router-dom";

function AddTask({}) {
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const prefillDate = q.get("date") || "";
  return <TaskForm prefillDate={prefillDate} />;
}

export default AddTask;
