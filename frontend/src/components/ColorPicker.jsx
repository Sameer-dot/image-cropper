import React from 'react';

function ColorPicker({ color, onChange }) {
  return (
    <div>
      <label className="input-group" style={{ marginBottom: '6px' }}>
        Border Color
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '60px',
            height: '42px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#1a1a1a';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e0e0';
          }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          style={{
            padding: '10px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            width: '120px',
            fontFamily: 'monospace',
            fontSize: '14px',
            transition: 'all 0.15s ease',
            backgroundColor: 'white',
            color: '#1a1a1a'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#1a1a1a';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e0e0';
          }}
        />
      </div>
    </div>
  );
}

export default ColorPicker;
