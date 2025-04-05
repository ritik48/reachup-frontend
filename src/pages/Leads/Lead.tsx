import { deleteLead, editLead, fetchLeads } from "@/apis";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import LeadTitleDialog from "./LeadDialog";
import { Mail, Trash, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function Lead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);

  // States for editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchConnectors = async () => {
      try {
        setLoading(true);
        const data = await fetchLeads();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setLeads(data.data);
      } catch (error) {
        setError("Failed to fetch connected email providers.");
      } finally {
        setLoading(false);
      }
    };
    fetchConnectors();
  }, []);

  const handleEditOpen = (lead: any) => {
    setEditId(lead._id);
    setEditName(lead.title);
    setEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!editName.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      setEditLoading(true);
      const result = await editLead(editId!, editName);
      if (!result.success) {
        toast.error(result.message || "Failed to update title");
        return;
      }

      toast.success("Title updated!");

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === editId ? { ...lead, title: editName } : lead
        )
      );

      setEditDialogOpen(false);
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);

      const result = await deleteLead(id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete.");
        return;
      }

      toast.success("Deleted.");

      setLeads((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="h-screen pt-[100px]">
      <div className="max-w-7xl mx-auto h-full sm:px-0 px-4">
        <div className="gap-2 items-start flex flex-col h-full w-full">
          <h1 className="text-3xl font-semibold">Leads</h1>

          {!loading && error && (
            <div className="text-sm font-red-500 mt-16">{error}</div>
          )}

          {loading && (
            <ClipLoader size={40} color="grey" className="mx-auto mt-20" />
          )}

          {!loading && !error && leads.length > 0 && (
            <div className="mt-4 space-y-6 w-full">
              <div className="flex flex-col gap-4">
                {leads.map((lead) => (
                  <div
                    key={lead._id}
                    className="border text-lg px-4 py-2 w-full flex items-center justify-between rounded-md hover:bg-gray-100"
                  >
                    <Link to={`${lead._id}`} className="w-full">
                      {lead.title}
                    </Link>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail size={18} />
                        <span className="font-semibold text-lg">
                          {lead.total}
                        </span>
                      </div>

                      <Button
                        variant={"outline"}
                        onClick={() => handleEditOpen(lead)}
                      >
                        <Pencil
                          size={18}
                          className="cursor-pointer text-blue-600"
                        />
                      </Button>

                      <Button
                        variant={"outline"}
                        disabled={deleting}
                        onClick={() => handleDelete(lead._id)}
                      >
                        {deleting && <ClipLoader size={12} color="grey" />}
                        <Trash
                          size={18}
                          className="cursor-pointer text-red-600"
                        />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <LeadTitleDialog />
            </div>
          )}

          {!loading && !error && leads.length === 0 && (
            <div className="flex justify-center mt-20 flex-1 w-full">
              <div className="flex gap-4 flex-col">
                <div className="text-xl text-muted-foreground">
                  You don't have any Leads.
                </div>
                <LeadTitleDialog />
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead Title</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter new name"
          />
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              className="cursor-pointer"
              disabled={editLoading}
            >
              {editLoading ? <ClipLoader size={12} color="grey" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
