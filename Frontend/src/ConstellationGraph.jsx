import { useMemo, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import "./ConstellationGraph.css";
import { useChat } from "./MyContext.jsx";

const nodeWidth = 280;
const nodeHeight = 80;
const xSpacing = 340;
const ySpacing = 120;

export default function ConstellationGraph() {
  const { prevChats, setViewMode } = useChat();

  // Create nodes and edges from linear prevChats
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Let's render them in a squiggly line or alternating layout to look like a constellation
    prevChats.forEach((chat, i) => {
      const isUser = chat.role === "user";
      
      // X position alternates, Y position drops down linearly
      const xOffset = isUser ? 0 : xSpacing;
      // Stagger Y slightly higher for AI nodes so they look nested
      const yOffset = i * ySpacing - (isUser ? 0 : ySpacing / 2);

      nodes.push({
        id: `node-${i}`,
        type: "default",
        data: {
          label: (
            <div className={`constellation-node-content ${isUser ? "node-user" : "node-ai"}`}>
              <div className="node-icon">{isUser ? "★" : "✦"}</div>
              <div className="node-text">
                {chat.content.substring(0, 60)}
                {chat.content.length > 60 ? "..." : ""}
              </div>
            </div>
          ),
        },
        position: { x: xOffset, y: yOffset },
        className: `constellation-node ${isUser ? "bg-user" : "bg-ai"}`,
        sourcePosition: isUser ? "right" : "bottom",
        targetPosition: isUser ? "top" : "left",
      });

      if (i > 0) {
        edges.push({
          id: `edge-${i - 1}-${i}`,
          source: `node-${i - 1}`,
          target: `node-${i}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "var(--accent)", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--accent)",
          },
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [prevChats]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Jump to chat view when a node is clicked
  const onNodeClick = useCallback((event, node) => {
    setViewMode("chat");
    // Optionally: scroll to node offset in actual chat list using refs
  }, [setViewMode]);

  return (
    <div className="constellation-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="dark-flow"
        minZoom={0.2}
      >
        <Background color="var(--border)" gap={24} size={1} />
        <Controls showInteractive={false} showZoom={true} />
        <MiniMap 
          nodeColor={(n) => n.className.includes("bg-user") ? "var(--surface-2)" : "var(--accent)"}
          maskColor="rgba(0,0,0, 0.4)"
          className="dark-minimap"
        />
      </ReactFlow>
    </div>
  );
}
