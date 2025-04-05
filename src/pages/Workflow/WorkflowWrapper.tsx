import { useWorkflow } from "@/contexts/WorfklowContext";
import { WorkflowSidebar } from "./Sidebar";
import { WorkflowCanvas } from "./WorfkflowCanvas";
import ClipLoader from "react-spinners/ClipLoader";

export function WorkflowWrapper({ id }: { id: string }) {
  const { loading } = useWorkflow();

  return (
    <div className="flex flex-1 overflow-hidden">
      {loading && (
        <ClipLoader size={30} color="grey" className="mx-auto mt-40" />
      )}
      {!loading && (
        <>
          <div className="w-[340px] flex-shrink-0">
            <WorkflowSidebar id={id!} />
          </div>
          <div className="flex-1 h-full">
            <WorkflowCanvas />
          </div>
        </>
      )}
    </div>
  );
}
