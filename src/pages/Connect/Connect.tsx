import { useEffect, useState } from "react";
import { ConnectorDialog } from "./ConnectorDialog";
import {
  deleteEmailSender,
  fetchConnectedEmails,
  verifyEmailSender,
} from "@/apis";
import toast from "react-hot-toast";
import { EmailProviderCard } from "./EmailProvider";
import ClipLoader from "react-spinners/ClipLoader";

export function Connect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectors, setConnectors] = useState<any[]>([]);

  useEffect(() => {
    const fetchConnectors = async () => {
      try {
        setLoading(true);
        const data = await fetchConnectedEmails();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setConnectors(data.data);
      } catch (error) {
        setError("Failed to fetch connected email providers.");
      } finally {
        setLoading(false);
      }
    };
    fetchConnectors();
  }, []);

  const onDelete = async (id: string) => {
    const data = await deleteEmailSender(id);
    if (data.success) {
      toast.success(data.message);
      setConnectors((prev) => prev.filter((item) => item._id !== id));
    } else {
      toast.error(data.message);
    }
  };
  const onVerify = async (id: string) => {
    const data = await verifyEmailSender(id);
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };
  const handleAddSender = async (data: any) => {
    setConnectors((prev) => [...prev, data]);
  };

  return (
    <div className="h-screen pt-[100px]">
      <div className="max-w-7xl mx-auto h-full sm:px-0 px-4">
        <div className="gap-2 items-start flex flex-col h-full">
          <h1 className="text-4xl">Your Email Senders</h1>
          {loading ? (
            <ClipLoader size={15} color="grey" />
          ) : connectors.length > 0 ? (
            <div className="mt-4 space-y-6">
              <div className="flex gap-6">
                {connectors.map((connector) => (
                  <EmailProviderCard
                    key={connector._id}
                    id={connector._id}
                    email={connector.email}
                    onVerify={onVerify}
                    onDelete={onDelete}
                    provider={connector.provider}
                  />
                ))}
              </div>
              <ConnectorDialog handleAddSender={handleAddSender} />
            </div>
          ) : (
            <div className="flex justify-center mt-20 flex-1 w-full">
              <div className="flex gap-4 flex-col">
                <div className="text-xl text-muted-foreground">
                  You don't have any connected email provider.
                </div>
                <ConnectorDialog handleAddSender={handleAddSender} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
