import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import ClipLoader from "react-spinners/ClipLoader";
import { fetchLeadItems } from "@/apis";
import { useNavigate, useParams } from "react-router-dom";

type LeadType = {
  _id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
};

export const LeadsDetail = () => {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const [headers, setHeaders] = useState<string[]>([]);
  const navigate = useNavigate();

  // Get current leads for pagination
  const indexOfLastLead = currentPage * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / itemsPerPage);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await fetchLeadItems(id!);
        if (!data.success) {
          setError("Cannot fetch the details.");
          return;
        }

        if (!data.data.processed) {
          navigate("new");
        }

        setTitle(data.data.title);

        let { __v, status, leadId, ...headersData } = data.data.leads[0];
        const headerKeys = Object.keys(headersData);

        const usefulData = data.data.leads.map((lead: any) => {
          const filtered: any = {};

          headerKeys.forEach((key) => {
            filtered[key] = lead[key];
          });
          return filtered;
        });
        const formattedHeaders = Object.keys(headersData).map(
          (k) => k.charAt(0).toUpperCase() + k.slice(1)
        );
        setLeads(usefulData);
        setHeaders(formattedHeaders);
      } catch (error) {
        setError("Cannot fetch the details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, []);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="h-screen pt-[100px]">
      <div className="max-w-7xl mx-auto h-full sm:px-0 px-4">
        {loading && <ClipLoader className="mt-10" size={15} color="grey" />}
        {error && <div className="text-sm text-red-500 mt-10">{error}</div>}
        {!loading && !error && (
          <Card className="w-full border-0 pb-[0px_!important] gap-0">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    {title}
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Total: {leads.length} leads
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      {headers.map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLeads.map((lead: any) => (
                      <TableRow key={lead.id} className="hover:bg-slate-50">
                        {Object.keys(lead).map((key) => (
                          <TableCell key={key}>{lead[key]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="py-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {pageNumbers.map((number) => (
                      <PaginationItem key={number}>
                        <PaginationLink
                          onClick={() => setCurrentPage(number)}
                          isActive={currentPage === number}
                        >
                          {number}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
