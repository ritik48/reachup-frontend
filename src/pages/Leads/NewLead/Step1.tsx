import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { ChevronRight, Upload, X } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

type UploadLeadProps = {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
  setFileName: (name: string | null) => void;
  nextStep: () => void;
  setFileData: (data: any) => void;
};

export const Step1 = ({
  handleFileUpload,
  fileName,
  setFileName,
  nextStep,
  setFileData,
}: UploadLeadProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg mb-4">Upload your CSV file</p>
          <p className="text-sm text-gray-500 mb-6">
            Drag & drop or click to browse
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={async (e) => {
              try {
                setLoading(true);
                await handleFileUpload(e);
              } catch (error) {
              } finally {
                setLoading(false);
              }
            }}
            className="hidden"
            id="csvFileUpload"
          />

          {loading ? (
            <div className="flex items-center gap-2">
              <ClipLoader size={15} color="grey" />
              <span className="text-sm">Uploading</span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer"
              asChild
              disabled={loading}
            >
              <label htmlFor="csvFileUpload">Select CSV File</label>
            </Button>
          )}

          {fileName && (
            <div className="mt-6 flex items-center p-2 bg-gray-100 rounded">
              <span className="mr-2">{fileName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFileName(null);
                  setFileData(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={nextStep}
            disabled={!fileName}
            className="flex items-center"
          >
            Next <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
