"use client";

import type React from "react";

import { Mail, Clock, Users } from "lucide-react";
import { useWorkflow } from "@/contexts/WorfklowContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { executeWorkflow } from "@/apis";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { ExecutionHistoryDialog } from "./ExecutionStatus";

export function WorkflowSidebar({ id }: { id: string }) {
  const { nodes, edges } = useWorkflow();
  const [loading, setLoading] = useState(false);

  const handleDragStart = (
    event: React.DragEvent,
    nodeType: "lead" | "delay" | "email"
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const scheduleWorkflow = async () => {
    try {
      setLoading(true);
      const data = await executeWorkflow(
        id,
        JSON.stringify(nodes),
        JSON.stringify(edges)
      );

      toast.success(data.message);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full border-r bg-background overflow-y-auto border-t">
      <div className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Drag and drop nodes to create your workflow
          </p>
        </div>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-sm font-medium mb-2">Nodes</h3>
        <div className="grid gap-2">
          <Card
            className="cursor-grab"
            draggable
            onDragStart={(e) => handleDragStart(e, "lead")}
          >
            <CardContent className="flex items-center gap-3 p-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Lead Source</p>
                <p className="text-xs text-muted-foreground">
                  Select leads for your workflow
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-grab"
            draggable
            onDragStart={(e) => handleDragStart(e, "delay")}
          >
            <CardContent className="flex items-center gap-3 p-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium">Wait/Delay</p>
                <p className="text-xs text-muted-foreground">
                  Add a time delay between steps
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-grab"
            draggable
            onDragStart={(e) => handleDragStart(e, "email")}
          >
            <CardContent className="flex items-center gap-3 p-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Cold Email</p>
                <p className="text-xs text-muted-foreground">
                  Select an email template
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="px-4 py-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
          </div>
          <ExecutionHistoryDialog workflowId={id} />

          <Button
            className="w-full"
            size="lg"
            onClick={scheduleWorkflow}
            disabled={loading}
          >
            {loading && <ClipLoader size={15} color="grey" />}
            {loading && "Scheduling..."}
            {!loading && "Schedule"}
          </Button>
        </div>
      </div>
    </div>
  );
}
