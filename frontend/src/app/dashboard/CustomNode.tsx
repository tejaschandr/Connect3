import * as React from "react";
import { Handle, NodeProps, Position } from "reactflow";

export const DEFAULT_NODE_STYLES: React.CSSProperties = {
  border: "2px solid black",
  height: 100,
  width: 100,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  pointerEvents: "all",
};

const CustomNode = (nodeInfo: NodeProps) => {
  return (
      <div
          data-nodeid={nodeInfo.id}
          style={{
              height: 100,
              width: 100,
              borderRadius: "50%",
              backgroundColor: nodeInfo.id === 'you' ? '#5f95ff' : '#fff', // Change to white for others
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black', // Border to distinguish nodes
          }}
      >
          <div style={{ color: nodeInfo.id === 'you' ? '#fff' : '#000' }}>
              {nodeInfo.data.label}
          </div>
          <Handle position={Position.Top} type="source" />
          <Handle position={Position.Bottom} type="target" />
      </div>
  );
};

