import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchWorkflowStatus } from "@/apis";

export function ExecutionHistoryDialog({ workflowId }: { workflowId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchWorkflowStatus(workflowId);
      if (!data.success) {
        throw new Error("Cannot fetch status.");
      }
      setStatus(data.data);
    } catch (error) {
      setError("Cannot fetch the status.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open) {
      await fetchStatus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">View Execution History</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Workflow Execution History</DialogTitle>
        </DialogHeader>

        {loading && <ClipLoader size={15} color="grey" />}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="font-medium">All Runs ({status.length})</div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {status.map((st: any, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        Run {index + 1} •{" "}
                        {format(
                          new Date(st.stats.createdAt),
                          "MMM d, yyyy h:mm a"
                        )}
                      </div>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-600"
                          >
                            Sent: {st.stats.sent}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-600"
                          >
                            Failed: {st.stats.failed}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600"
                          >
                            Scheduled: {st.stats.scheduled}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      {st.stats.scheduled > 0 ? (
                        <Badge variant="secondary">In Progress</Badge>
                      ) : (
                        <Badge variant="default">Completed</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
