import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
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
  const [editingLead, setEditingLead] = useState<LeadType | null>(null);
  const [deletingLead, setDeletingLead] = useState<LeadType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  // Handle edit lead
  const handleEditClick = (lead: LeadType) => {
    setEditingLead({ ...lead });
    setIsEditDialogOpen(true);
  };

  // Save edited lead
  const handleSaveEdit = () => {
    console.log({ editingLead, leads });
    if (editingLead) {
      setLeads(
        leads.map((lead) => (lead._id === editingLead._id ? editingLead : lead))
      );
      setIsEditDialogOpen(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (lead: LeadType) => {
    setDeletingLead(lead);
    setIsDeleteDialogOpen(true);
  };

  // Confirm and delete lead
  const handleConfirmDelete = () => {
    if (deletingLead) {
      setLeads(leads.filter((lead) => lead._id !== deletingLead._id));
      setIsDeleteDialogOpen(false);

      if (currentLeads.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

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

        console.log("hhhhhhhhhhhhhhhhhhhhhhh");

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
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add New Lead
                </Button>
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

                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLeads.map((lead: any) => (
                      <TableRow key={lead.id} className="hover:bg-slate-50">
                        {Object.keys(lead).map((key) => (
                          <TableCell key={key}>{lead[key]}</TableCell>
                        ))}

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(lead)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(lead)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
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

            {/* Edit Dialog */}
            {editingLead && (
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Lead</DialogTitle>
                    <DialogDescription>
                      Make changes to the lead information below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {headers.map((h: string) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={h} className="text-right">
                          {h}
                        </Label>
                        <Input
                          id="name"
                          value={(editingLead as any)[h.toLowerCase()]}
                          onChange={(e) =>
                            setEditingLead({
                              ...editingLead,
                              [h.toLowerCase()]: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            {deletingLead && (
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {deletingLead.name}'s lead
                      information. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirmDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
