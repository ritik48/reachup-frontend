"use client";

import { WorkflowProvider } from "@/contexts/WorfklowContext";
import { WorkflowSidebar } from "./Sidebar";
import { WorkflowCanvas } from "./WorfkflowCanvas";
import { Navbar } from "@/components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
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
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[340px] flex-shrink-0">
            <WorkflowSidebar id={id!} />
          </div>
          <div className="flex-1 h-full">
            <WorkflowCanvas />
          </div>
        </div>
      </div>
    </WorkflowProvider>
  );
}
