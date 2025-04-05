import { useEffect, useState } from "react";
import { deleteWorkflow, editWorkflow, fetchAllWorkflow } from "@/apis";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { WorkflowDialog } from "./WorkflowDialog";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";

export function Workflow() {
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  console.log(error)
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [currentEditWorkflow, setCurrentEditWorkflow] = useState<any>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await fetchAllWorkflow();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setWorkflows(data.data);
    } catch (error) {
      setError("Failed to fetch workflows.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoadingId(id);
      const res = await deleteWorkflow(id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setWorkflows((prev) => prev.filter((p) => p._id !== id));

      toast.success("Workflow deleted.");
    } catch (err) {
      toast.error("Failed to delete.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const openEditDialog = (workflow: any) => {
    setCurrentEditWorkflow(workflow);
    setEditName(workflow.name);
    setEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!currentEditWorkflow) return;
    try {
      setEditLoading(true);
      const res = await editWorkflow(currentEditWorkflow._id, editName);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setWorkflows((prev) =>
        prev.map((p) =>
          p._id === currentEditWorkflow._id
            ? { ...currentEditWorkflow, name: editName }
            : p
        )
      );

      toast.success("Workflow updated.");
      setEditDialogOpen(false);
    } catch (err) {
      toast.error("Edit failed.");
    } finally {
      setEditLoading(false);
    }
  };

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
        <Badge variant="outline" className="bg-green-50 text-green-600">
          Sent: {total.sent}
        </Badge>
        <Badge variant="outline" className="bg-red-50 text-red-600">
          Failed: {total.failed}
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-600">
          Scheduled: {total.scheduled}
        </Badge>
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
                  <div
                    key={w._id}
                    className="border w-full px-4 py-3 rounded-md flex justify-between items-start hover:bg-gray-100"
                  >
                    <Link to={`/workflow/${w._id}`} className="w-full">
                      {w.name}

                      <div className="font-medium text-sm">
                        Runs: {w.stats.length}
                      </div>
                      {getStats(w.stats)}
                    </Link>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(w)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(w._id)}
                        disabled={deleteLoadingId === w._id}
                      >
                        {deleteLoadingId === w._id ? (
                          <ClipLoader size={12} color="grey" />
                        ) : (
                          <Trash size={15} />
                        )}
                      </Button>
                    </div>
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workflow Name</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter new name"
          />
          <DialogFooter className="mt-4">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleEdit}
              disabled={editLoading}
            >
              {editLoading ? <ClipLoader size={12} color="white" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
