import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

type Provider = "google" | "outlook" | "other";

type EmailProviderCardProps = {
  email: string;
  id: string;
  provider: Provider;
  onVerify: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function EmailProviderCard({
  email,
  id,
  provider,
  onVerify,
  onDelete,
}: EmailProviderCardProps) {
  const providerLogos = {
    google: "https://logo.clearbit.com/google.com",
    outlook: "https://logo.clearbit.com/outlook.com",
    other: "https://logo.clearbit.com/mail.com",
  };

  // Provider display name
  const providerNames = {
    google: "Google",
    outlook: "Outlook",
    other: "Custom SMTP",
  };

  const [verifying, setVerifying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="border rounded-lg p-4 w-full max-w-sm bg-card shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Provider Avatar */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={providerLogos[provider]} alt={provider} />
          <AvatarFallback>{providerNames[provider].charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Email Info */}
        <div className="flex-1">
          <p className="font-medium">{providerNames[provider]}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 justify-end">
        <Button
          variant={"ghost"}
          disabled={deleting}
          size="sm"
          onClick={async () => {
            try {
              setDeleting(true);
              await onDelete(id);
            } catch {
            } finally {
              setDeleting(false);
            }
          }}
          className="gap-2 cursor-pointer"
        >
          {deleting && <ClipLoader size={15} color="grey" />}

          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          disabled={verifying}
          size="sm"
          onClick={async () => {
            try {
              setVerifying(true);
              await onVerify(id);
            } catch {
            } finally {
              setVerifying(false);
            }
          }}
          className="gap-2 cursor-pointer"
        >
          {verifying && <ClipLoader size={15} color="grey" />}
          Verify
        </Button>
      </div>
    </div>
  );
}
