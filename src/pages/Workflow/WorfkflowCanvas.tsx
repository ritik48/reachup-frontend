"use client";

import type React from "react";

import { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  type NodeTypes,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflow } from "@/contexts/WorfklowContext";
import { LeadNode } from "./nodes/lead";
import { DelayNode } from "./nodes/delay";
import { EmailNode } from "./nodes/email";

const nodeTypes: NodeTypes = {
  leadNode: LeadNode,
  delayNode: DelayNode,
  emailNode: EmailNode,
};

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useWorkflow();

  console.log({ nodes, edges });

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow") as
        | "lead"
        | "delay"
        | "email";

      // Check if the dropped element is valid
      if (!type) return;

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type, position);
    },
    [project, addNode]
  );

  return (
    <div className="h-full w-full border-t" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.5}
        maxZoom={2}
        className="bg-dot-pattern"
      >
        <Background gap={12} size={1} />
        <Controls />
        <Panel position="top-right">
          <div className="rounded-md bg-background p-2 shadow-md">
            <p className="text-sm font-medium">Workflow Rules:</p>
            <ul className="text-xs text-muted-foreground">
              <li>• Multiple leads can connect to a delay node</li>
              <li>• Only one email template per delay node</li>
              <li>• Lead nodes can connect directly to email nodes</li>
            </ul>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
