"use client";

import { useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Mail, Trash2 } from "lucide-react";
import { type NodeData, useWorkflow } from "@/contexts/WorfklowContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const EMAIL_TEMPLATES = [
  { id: "1", name: "Introduction Email", subject: "Nice to meet {email}" },
  {
    id: "2",
    name: "Follow-up Email",
    subject: "hey {email}, Following up on our conversation {name}",
  },
];

export function EmailNode({ id, data }: NodeProps<NodeData>) {
  const { updateNodeData, removeNode } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    data.config?.template || ""
  );

  const handleSave = () => {
    updateNodeData(id, {
      ...data,
      config: {
        ...data.config,
        template: selectedTemplate,
      },
    });
    setOpen(false);
  };

  const selectedTemplateName =
    EMAIL_TEMPLATES.find((t) => t.id === selectedTemplate)?.name ||
    "No template selected";

  return (
    <div className="relative rounded-md border bg-background p-3 shadow-md">
      <Handle
        type="target"
        position={Position.Top}
        className="!left-12 !top-0"
      />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Mail className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{data.label}</p>
          <p className="text-xs text-muted-foreground">
            {selectedTemplate ? selectedTemplateName : "No template selected"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => removeNode(id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete node</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-full">
            {selectedTemplate ? "Change Template" : "Select Template"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Email Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Choose a template</Label>
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {EMAIL_TEMPLATES.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate === template.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-3">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Subject: {template.subject}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
