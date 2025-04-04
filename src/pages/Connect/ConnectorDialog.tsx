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
import { EmailConfigForm } from "./EmailConfigFor";

export function ConnectorDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="cursor-pointer" onClick={() => console.log("ergre")}>
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
          <EmailConfigForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
