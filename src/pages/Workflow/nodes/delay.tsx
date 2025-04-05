"use client";

import { useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Clock, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DelayNode({ id, data }: NodeProps<NodeData>) {
  const { updateNodeData, removeNode } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [delayType, setDelayType] = useState<"minutes" | "hours" | "days">(
    "minutes"
  );
  const [delayValue, setDelayValue] = useState<number>(
    data.config?.delayTime || 1
  );

  const handleSave = () => {
    let delayTimeInMinutes = 0;

    // Convert to minutes
    switch (delayType) {
      case "minutes":
        delayTimeInMinutes = delayValue;
        break;
      case "hours":
        delayTimeInMinutes = delayValue * 60;
        break;
      case "days":
        delayTimeInMinutes = delayValue * 24 * 60;
        break;
    }

    updateNodeData(id, {
      ...data,
      config: {
        ...data.config,
        delayTime: delayTimeInMinutes,
      },
    });
    setOpen(false);
  };

  const formatDelayDisplay = () => {
    if (!data.config?.delayTime) return "No delay set";

    const minutes = data.config.delayTime;
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (minutes < 60 * 24) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(minutes / (60 * 24));
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="relative rounded-md border bg-background p-3 shadow-md">
      <Handle
        type="target"
        position={Position.Top}
        className="!left-12 !top-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bottom-0 !right-12"
      />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Clock className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{data.label}</p>
          <p className="text-xs text-muted-foreground">
            {formatDelayDisplay()}
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
            {data.config?.delayTime ? "Edit Delay" : "Set Delay"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Delay Time</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="delay-value">Wait for</Label>
                <Input
                  id="delay-value"
                  type="number"
                  min="1"
                  value={delayValue}
                  onChange={(e) =>
                    setDelayValue(Number.parseInt(e.target.value) || 1)
                  }
                />
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="delay-unit">Unit</Label>
                <Select
                  value={delayType}
                  onValueChange={(value) => setDelayType(value as any)}
                >
                  <SelectTrigger id="delay-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick presets</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDelayType("minutes");
                    setDelayValue(1);
                  }}
                >
                  1 min
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDelayType("minutes");
                    setDelayValue(5);
                  }}
                >
                  5 min
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDelayType("minutes");
                    setDelayValue(15);
                  }}
                >
                  15 min
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDelayType("hours");
                    setDelayValue(1);
                  }}
                >
                  1 hour
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDelayType("days");
                    setDelayValue(1);
                  }}
                >
                  1 day
                </Button>
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
