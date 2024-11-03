import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }: { data: any }) => {
  return (
    <div style={{
      background: data.isYou ? '#e2e8f0' : '#fff', // Different background for "you" node
      border: '1px solid #888',
      borderRadius: '50%',
      width: 80,
      height: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '10px',
    }}>
      <div style={{
        textAlign: 'center',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          opacity: 0, // Make handle invisible
          left: '50%',
          top: '50%',
          transform: 'translate(50%, -50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0, // Make handle invisible
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

export default CustomNode;