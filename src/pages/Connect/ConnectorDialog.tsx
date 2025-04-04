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
import { EmailConfigForm } from "./EmailConfigForm";
import { useState } from "react";

type ConnectorDialogProps = {
  handleAddSender: (data: any) => void;
};

export function ConnectorDialog({ handleAddSender }: ConnectorDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="cursor-pointer">
          Connect your email <FaPlus size={10} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3 text-lg">Add email sender</DialogTitle>
          <DialogDescription hidden>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <EmailConfigForm
            setOpen={setOpen}
            handleAddSender={handleAddSender}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
