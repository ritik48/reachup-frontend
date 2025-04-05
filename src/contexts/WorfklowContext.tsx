"use client";

import { fetchWorkflow } from "@/apis";
import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";

export type NodeData = {
  label: string;
  type: "lead" | "delay" | "email";
  config: {
    lead?: { _id: string; title: string };
    delayTime?: number;
    template?: string;
  };
};

export type WorkflowDetails = {
  title: string;
  active: boolean;
  emailProvider: string;
};

type WorkflowContextType = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  workflowDetails: WorkflowDetails;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  updateWorkflowDetails: (details: Partial<WorkflowDetails>) => void;
  addNode: (type: NodeData["type"], position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
};

const initialWorkflowDetails: WorkflowDetails = {
  title: "New Workflow",
  active: false,
  emailProvider: "",
};

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export function WorkflowProvider({
  children,
  workflowId,
}: {
  children: React.ReactNode;
  workflowId: string;
}) {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [workflowDetails, setWorkflowDetails] = useState<WorkflowDetails>(
    initialWorkflowDetails
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitialWorkflow = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkflow(workflowId);
        console.log({ data });

        if (!data.success) {
          navigate("/workflow");
        }

        setWorkflowDetails({
          title: data.data.title as string,
          emailProvider: data.data.emailProvider as string,
          active: data.data.active,
        });
        const nodes = JSON.parse(data.data.nodes || "[]");
        const edges = JSON.parse(data.data.edges || "[]");

        setNodes(nodes);
        setEdges(edges);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialWorkflow();
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // Check if the source is a lead node and target is a delay node
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      // Validation rules
      if (
        sourceNode?.data.type === "lead" &&
        targetNode?.data.type === "delay"
      ) {
        setEdges((eds) => addEdge(connection, eds));
      }
      // Lead node to email node is allowed
      else if (
        sourceNode?.data.type === "lead" &&
        targetNode?.data.type === "email"
      ) {
        setEdges((eds) => addEdge(connection, eds));
      }
      // Delay node to email node (only one allowed)
      else if (
        sourceNode?.data.type === "delay" &&
        targetNode?.data.type === "email"
      ) {
        // Check if delay node already has a connection to an email node
        const existingConnection = edges.find(
          (edge) =>
            edge.source === connection.source &&
            nodes.find((n) => n.id === edge.target)?.data.type === "email"
        );

        if (!existingConnection) {
          setEdges((eds) => addEdge(connection, eds));
        }
      }
    },
    [nodes, edges]
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<NodeData>) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    []
  );

  const updateWorkflowDetails = useCallback(
    (details: Partial<WorkflowDetails>) => {
      setWorkflowDetails((prev) => ({ ...prev, ...details }));
    },
    []
  );

  const addNode = useCallback(
    (type: NodeData["type"], position: { x: number; y: number }) => {
      const newNode: Node<NodeData> = {
        id: uuidv4(),
        type:
          type === "lead"
            ? "leadNode"
            : type === "delay"
            ? "delayNode"
            : "emailNode",
        position,
        data: {
          label:
            type === "lead"
              ? "Lead Source"
              : type === "delay"
              ? "Wait/Delay"
              : "Cold Email",
          type,
          config: {},
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    []
  );

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        edges,
        workflowDetails,
        onNodesChange,
        onEdgesChange,
        onConnect,
        updateNodeData,
        updateWorkflowDetails,
        addNode,
        removeNode,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}
