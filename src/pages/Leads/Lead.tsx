import { fetchLeads } from "@/apis";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import LeadTitleDialog from "./LeadDialog";

export function Lead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);

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

  return (
    <div className="h-screen pt-[100px]">
      <div className="max-w-7xl mx-auto h-full sm:px-0 px-4">
        <div className="gap-2 items-start flex flex-col h-full w-full">
          <h1 className="text-4xl">Your Email Senders</h1>

          {!loading && error && (
            <div className="text-sm font-red-500 mt-16">{error}</div>
          )}

          {loading && <ClipLoader size={15} color="grey" />}
          {!loading && !error && leads.length > 0 && (
            <div className="mt-4 space-y-6 w-full">
              <div className="flex gap-6">
                {leads.map((lead) => (
                  <Link
                    to={`${lead._id}/new`}
                    className="border text-lg px-1 py-2 w-full"
                    key={lead._id}
                  >
                    {lead.title}
                  </Link>
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
    </div>
  );
}
