import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { finalSaveLead } from "@/apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

type Step3Props = {
  fileName: string | null;
  fileData: any;
  mappedColumns: any;
  standardVariables: { label: string; value: string }[];
  prevStep: () => void;
  title: string;
  setTitle: (value: string) => void;
  id: string;
};

export const Step3 = ({
  fileData,
  mappedColumns,
  standardVariables,
  prevStep,
  title,
  setTitle,
  id,
}: Step3Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSaveLead = async () => {
    try {
      setLoading(true);
      const data = await finalSaveLead(id, Object.values(mappedColumns), title);
      if (!data.success) {
        toast.error("Could not save.");
        return;
      }
      navigate(`/leads/${id}`);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Review and Finalize</h2>

        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-md font-semibold mb-2 text-green-700">
            Upload Summary
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>
                Title:{" "}
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />{" "}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>
                Columns Mapped:{" "}
                {Object.values(mappedColumns).filter((v) => v !== "").length} of{" "}
                {fileData?.headers.length}
              </span>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold mb-3">Column Mapping</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CSV Column</TableHead>
                <TableHead>Mapped Variable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fileData &&
                fileData.headers.map((header: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{header}</TableCell>
                    <TableCell>
                      {mappedColumns[header] ? (
                        standardVariables.find(
                          (v) => v.value === mappedColumns[header]
                        )?.label || mappedColumns[header]
                      ) : (
                        <span className="text-amber-600">Not Mapped</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button
            variant="default"
            className="flex items-center"
            onClick={handleSaveLead}
          >
            {loading && <ClipLoader size={15} color="grey" />}
            Import Leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
