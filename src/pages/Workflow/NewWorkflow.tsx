"use client";

import { WorkflowProvider } from "@/contexts/WorfklowContext";

import { Navbar } from "@/components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { WorkflowWrapper } from "./WorkflowWrapper";
// import { Navbar } from "@/components/navbar";

export function WorkflowExecution() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate("/workflow");
  }

  return (
    <WorkflowProvider workflowId={id!}>
      <div className="flex h-screen pt-[70px] w-screen flex-col overflow-hidden">
        <Navbar />
        <WorkflowWrapper id={id!} />
      </div>
    </WorkflowProvider>
  );
}
