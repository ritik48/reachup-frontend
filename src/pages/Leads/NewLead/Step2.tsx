import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CheckCircle, AlertCircle } from "lucide-react";

type MapLeadProps = {
  fileData: any;
  mappedColumns: any;
  handleMapping: (header: string, value: string) => void;
  standardVariables: { label: string; value: string }[];
  prevStep: () => void;
  nextStep: () => void;
};

export const Step2 = ({
  fileData,
  mappedColumns,
  handleMapping,
  standardVariables,
  prevStep,
  nextStep,
}: MapLeadProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">
          Map CSV Columns to Variables
        </h2>

        {fileData && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Data Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Map to Variable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileData.headers.map((header: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{header}</TableCell>
                    <TableCell className="text-gray-600">
                      {fileData.firstRow[index]}
                    </TableCell>
                    <TableCell>
                      {mappedColumns[header] ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600 border-green-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Mapped
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-600 border-amber-200"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" /> Not Mapped
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={mappedColumns[header]}
                        onValueChange={(value) => handleMapping(header, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select variable" />
                        </SelectTrigger>
                        <SelectContent>
                          {standardVariables.map((variable) => (
                            <SelectItem
                              key={variable.value}
                              value={variable.value}
                            >
                              {variable.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={Object.values(mappedColumns).some(
              (value) => value === ""
            )}
            className="flex items-center"
          >
            Next <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
