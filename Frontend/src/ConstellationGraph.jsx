import { useMemo, useCallback, useEffect } from "react";
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
  const { prevChats, setViewMode, setActiveMessageIndex, currThreadId } = useChat();

  // Create nodes and edges from linear prevChats
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Simple tree structure, showing user chats with AI chats beneath them
    let userIndex = 0;

    prevChats.forEach((chat, i) => {
      const isUser = chat.role === "user";

      if (isUser) {
        // Top-down tree, alternating slightly left and right
        const xOffset = userIndex % 2 === 0 ? -150 : 150;
        const yOffset = userIndex * 180;

        const content = chat.content || "";

        nodes.push({
          id: `node-${i}`,
          type: "default",
          data: {
            originalIndex: i,
            label: (
              <div className="constellation-node-content node-user">
                <div className="node-icon">○</div>
                <div className="node-text">
                  {content.substring(0, 60)}
                  {content.length > 60 ? "..." : ""}
                </div>
              </div>
            ),
          },
          position: { x: xOffset, y: yOffset },
          className: "constellation-node bg-user",
          sourcePosition: "bottom",
          targetPosition: "top",
        });

        // Link to previous user node
        if (userIndex > 0) {
          let prevUserIndex = i - 1;
          while (prevUserIndex >= 0 && prevChats[prevUserIndex].role !== "user") {
            prevUserIndex--;
          }
          if (prevUserIndex >= 0) {
            edges.push({
              id: `edge-${prevUserIndex}-${i}`,
              source: `node-${prevUserIndex}`,
              target: `node-${i}`,
              type: "step",
              animated: false,
              style: { stroke: "var(--text-muted)", strokeWidth: 2, strokeDasharray: "8,8" },
            });
          }
        }
        
        userIndex++;
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [prevChats]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Safely sync ReactFlow state when new derived layout happens (like new messages)
  useEffect(() => {
    console.log("ConstellationGraph syncing with nodes:", initialNodes);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Jump to chat view when a node is clicked
  const onNodeClick = useCallback((event, node) => {
    if (node.data && node.data.originalIndex !== undefined) {
      setActiveMessageIndex(node.data.originalIndex);
    }
    setViewMode("chat");
  }, [setViewMode, setActiveMessageIndex]);

  // Memoize empty node/edge types to stop ReactFlow warning #002
  const nodeTypes = useMemo(() => ({}), []);
  const edgeTypes = useMemo(() => ({}), []);

  return (
    <div className="constellation-wrapper">
      <ReactFlow
        style={{ width: "100%", height: "100%" }}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
