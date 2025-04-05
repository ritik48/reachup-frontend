"use client";

import { useEffect, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Trash2, Users } from "lucide-react";
import { type NodeData, useWorkflow } from "@/contexts/WorfklowContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchLeads } from "@/apis";


type LeadNodeType = { _id: string; title: string };

export function LeadNode({ id, data }: NodeProps<NodeData>) {
  const { updateNodeData, removeNode } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadNodeType | undefined>(
    data.config.lead
  );
  const [availableLeads, setAvailableLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllLeads = async () => {
      const data = await fetchLeads();
      console.log({ data });
      setAvailableLeads(data.data);
    };
    fetchAllLeads();
  }, []);

  const handleSave = () => {
    updateNodeData(id, {
      ...data,
      config: {
        ...data.config,
        lead: selectedLead,
      },
    });
    setOpen(false);
  };

  return (
    <div className="relative rounded-md border bg-background p-3 shadow-md">
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bottom-0 !right-12"
      />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Users className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{data.label}</p>
          <p className="text-xs text-muted-foreground">{selectedLead?.title}</p>
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
            {selectedLead ? "Edit Leads" : "Select Leads"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Leads</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Select
              onValueChange={(value) => {
                const selected = JSON.parse(value);
                setSelectedLead(selected);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                {availableLeads.map((av) => (
                  <SelectItem
                    key={av._id}
                    value={JSON.stringify({ _id: av._id, title: av.title })}
                  >
                    {av.title}
                  </SelectItem>
                ))}
                {/* 
                <SelectItem value="all">Select All</SelectItem>
                <SelectItem value="none">Select None</SelectItem> */}
              </SelectContent>
            </Select>

            {/* <div className="max-h-[300px] space-y-2 overflow-y-auto">
              {AVAILABLE_LEADS.map((lead) => (
                <div key={lead.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lead-${lead.id}`}
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLeads([...selectedLeads, lead.id]);
                      } else {
                        setSelectedLeads(
                          selectedLeads.filter((id) => id !== lead.id)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={`lead-${lead.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {lead.email}
                    </div>
                  </Label>
                </div>
              ))}
            </div> */}
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
