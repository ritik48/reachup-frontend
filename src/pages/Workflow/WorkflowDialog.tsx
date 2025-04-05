import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa6";
import { WorkflowConfigForm } from "./WorkflowConfigForm";
import { useState } from "react";

export function WorkflowDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="cursor-pointer">
          Create email workflow <FaPlus size={10} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3 text-lg">Add email sender</DialogTitle>
          <DialogDescription hidden>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <WorkflowConfigForm setOpen={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
