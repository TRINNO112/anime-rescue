import React from 'react';

export function MobileControls({ onTouchStartKey, onTouchEndKey }) {
  return (
    <div className="mobile-touch-gamepad">
      {/* Directional D-Pad Left / Right */}
      <div className="dpad-container">
        <button
          className="touch-btn dpad-left"
          onTouchStart={(e) => { e.preventDefault(); onTouchStartKey('left'); }}
          onTouchEnd={(e) => { e.preventDefault(); onTouchEndKey('left'); }}
          onMouseDown={() => onTouchStartKey('left')}
          onMouseUp={() => onTouchEndKey('left')}
        >
          ◀
        </button>
        <button
          className="touch-btn dpad-right"
          onTouchStart={(e) => { e.preventDefault(); onTouchStartKey('right'); }}
          onTouchEnd={(e) => { e.preventDefault(); onTouchEndKey('right'); }}
          onMouseDown={() => onTouchStartKey('right')}
          onMouseUp={() => onTouchEndKey('right')}
        >
          ▶
        </button>
      </div>

      {/* Action Buttons Jump / Attack */}
      <div className="action-container">
        <button
          className="touch-btn action-attack"
          onTouchStart={(e) => { e.preventDefault(); onTouchStartKey('attack'); }}
          onTouchEnd={(e) => { e.preventDefault(); onTouchEndKey('attack'); }}
          onMouseDown={() => onTouchStartKey('attack')}
          onMouseUp={() => onTouchEndKey('attack')}
        >
          ⚔️
        </button>
        <button
          className="touch-btn action-jump"
          onTouchStart={(e) => { e.preventDefault(); onTouchStartKey('jump'); }}
          onTouchEnd={(e) => { e.preventDefault(); onTouchEndKey('jump'); }}
          onMouseDown={() => onTouchStartKey('jump')}
          onMouseUp={() => onTouchEndKey('jump')}
        >
          🦘
        </button>
      </div>
    </div>
  );
}
