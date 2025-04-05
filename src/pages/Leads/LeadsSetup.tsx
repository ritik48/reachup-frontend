import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Step1 } from "./NewLead/Step1";
import { Step2 } from "./NewLead/Step2";
import { Step3 } from "./NewLead/Step3";
import { useParams } from "react-router-dom";
import { fetchLeadsById, uploadfile } from "@/apis";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

export const LeadsSetup = () => {
  const [activeStep, setActiveStep] = useState("step1");
  const [fileName, setFileName] = useState<any>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [mappedColumns, setMappedColumns] = useState<any>({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await fetchLeadsById(id!);

        if (!data.success) {
          throw new Error("Invalid request");
        }
        if (!data.data[0]) {
          throw new Error("Invalid request");
        }
        if (data.data[0].processed) {
          throw new Error("Invalid request");
        }

        setTitle(data.data[0].title || "");
      } catch (error) {
        setError("Could not fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Standard variable options
  const standardVariables = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "state", label: "State" },
    { value: "country", label: "Country" },
    { value: "skip", label: "Skip Variable" },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await new Promise((r) => setTimeout(r, 5000));
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id!); // Replace with the actual ID

    const data = await uploadfile(formData);

    if (!data.success) {
      toast.error("Error uploading the file");
      return;
    }

    console.log({ data });
    setFileName(file.name);
    setFileData({ headers: data.headers, firstRow: data.firstRow });

    const initialMapping: any = {};
    data.headers.forEach((header: string) => {
      initialMapping[header] = "";
    });
    setMappedColumns(initialMapping);
  };

  const handleMapping = (columnName: any, variableValue: any) => {
    setMappedColumns({
      ...mappedColumns,
      [columnName]: variableValue,
    });
  };

  const nextStep = () => {
    if (activeStep === "step1") setActiveStep("step2");
    if (activeStep === "step2") setActiveStep("step3");
  };

  const prevStep = () => {
    if (activeStep === "step2") setActiveStep("step1");
    if (activeStep === "step3") setActiveStep("step2");
  };

  return (
    <div className="container mx-auto pt-[100px] sm:px-0 px-4">
      <h1 className="text-2xl font-bold mb-6">Upload Leads</h1>
      {loading && <ClipLoader size={15} color="grey" />}

      {!loading && error && <div className="mt-10 text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="mt-4">
          <div className="text-xl">{title}</div>
          <Tabs value={activeStep} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger
                value="step1"
                onClick={() => setActiveStep("step1")}
                disabled={activeStep !== "step1" && !fileName}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                1. Upload CSV
              </TabsTrigger>
              <TabsTrigger
                value="step2"
                onClick={() => setActiveStep("step2")}
                disabled={activeStep === "step1" || !fileData}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                2. Map Columns
              </TabsTrigger>
              <TabsTrigger
                value="step3"
                onClick={() => setActiveStep("step3")}
                disabled={activeStep !== "step3"}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                3. Finalize
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step1">
              <Step1
                handleFileUpload={handleFileUpload}
                setFileData={setFileData}
                setFileName={setFileName}
                fileName={fileName}
                nextStep={nextStep}
              />
            </TabsContent>

            <TabsContent value="step2">
              <Step2
                handleMapping={handleMapping}
                standardVariables={standardVariables}
                nextStep={nextStep}
                prevStep={prevStep}
                fileData={fileData}
                mappedColumns={mappedColumns}
              />
            </TabsContent>

            <TabsContent value="step3">
              <Step3
                fileName={fileName}
                fileData={fileData}
                prevStep={prevStep}
                mappedColumns={mappedColumns}
                standardVariables={standardVariables}
                title={title}
                setTitle={setTitle}
                id={id!}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
