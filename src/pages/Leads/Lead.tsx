import { fetchLeads } from "@/apis";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import LeadTitleDialog from "./LeadDialog";
import { Mail } from "lucide-react";

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
          <h1 className="text-4xl">Leads</h1>

          {!loading && error && (
            <div className="text-sm font-red-500 mt-16">{error}</div>
          )}

          {loading && <ClipLoader size={15} color="grey" />}
          {!loading && !error && leads.length > 0 && (
            <div className="mt-4 space-y-6 w-full">
              <div className="flex gap-6">
                {leads.map((lead) => (
                  <div className="border text-lg px-4 py-2 w-full flex items-center justify-between rounded-md">
                    <Link to={`${lead._id}`} className="" key={lead._id}>
                      {lead.title}
                    </Link>
                    <span className="flex items-center  gap-2">
                      <Mail size={15} />
                      <span className="text-sm font-semibold">
                        {lead.total}
                      </span>
                    </span>
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
    </div>
  );
}
