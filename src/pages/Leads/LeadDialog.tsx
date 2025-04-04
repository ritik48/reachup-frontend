import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createLead } from "@/apis";
import ClipLoader from "react-spinners/ClipLoader";

const LeadTitleDialog = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Please provide lead title.");
      return;
    }
    try {
      setLoading(true);
      const data = await createLead(title);
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      navigate(`/leads/${data.id}/new`);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Lead</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Lead Title</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter lead title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <DialogFooter>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading && <ClipLoader size={15} color="grey" />} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadTitleDialog;
