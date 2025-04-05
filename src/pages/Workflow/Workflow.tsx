import { useEffect, useState } from "react";

import { fetchAllWorkflow } from "@/apis";
import toast from "react-hot-toast";

import ClipLoader from "react-spinners/ClipLoader";
import { WorkflowDialog } from "./WorkflowDialog";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function Workflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        const data = await fetchAllWorkflow();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setWorkflows(data.data);
        console.log(data.data);
      } catch (error) {
        setError("Failed to fetch connected email providers.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflows();
  }, []);

  const getStats = (stats: any[]) => {
    const total = stats.reduce(
      (acc, stat) => {
        acc.scheduled += stat.stats.scheduled || 0;
        acc.failed += stat.stats.failed || 0;
        acc.sent += stat.stats.sent || 0;
        return acc;
      },
      { scheduled: 0, failed: 0, sent: 0 }
    );

    return (
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-green-50 text-green-600">
            Sent: {total.sent}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-red-50 text-red-600">
            Failed: {total.failed}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            Scheduled: {total.scheduled}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen pt-[100px]">
      <div className="max-w-7xl mx-auto h-full sm:px-0 px-4">
        <div className="gap-2 items-start flex flex-col h-full">
          <h1 className="text-3xl font-semibold">Your Email Workflows</h1>
          {loading ? (
            <ClipLoader size={15} color="grey" />
          ) : workflows.length > 0 ? (
            <div className="mt-4 space-y-6 w-full">
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-scroll">
                {workflows.map((w) => (
                  <div className="border w-full px-4 py-2 rounded-md">
                    <div className="flex flex-col items-start">
                      <Link
                        to={`/workflow/${w._id}`}
                        className="text-lg mb-1 font-medium"
                      >
                        {w.name}
                      </Link>
                      <div className="font-medium text-sm">
                        Runs: {w.stats.length}
                      </div>
                    </div>
                    {getStats(w.stats)}
                  </div>
                ))}
              </div>
              <WorkflowDialog />
            </div>
          ) : (
            <div className="flex justify-center mt-20 flex-1 w-full">
              <div className="flex gap-4 flex-col">
                <div className="text-xl text-muted-foreground">
                  You don't have any workflows.
                </div>
                <WorkflowDialog />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
