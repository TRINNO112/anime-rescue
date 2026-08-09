import React from 'react';

export function HUD({ currentScore, playerHp, maxHp, rescuedList, isMuted, onToggleAudio }) {
  // Render health hearts
  const hearts = [];
  for (let i = 0; i < maxHp; i++) {
    hearts.push(
      <span key={i} className={`hp-heart ${i < playerHp ? 'active' : 'empty'}`}>
        ❤️
      </span>
    );
  }

  return (
    <div className="game-hud minecraft-hud">
      <div className="hud-left">
        <div className="hud-hearts">{hearts}</div>
        {rescuedList.length > 0 && (
          <div className="party-badges">
            {rescuedList.map((char) => (
              <span key={char.id} className="party-pill" style={{ color: char.color, borderColor: char.color }}>
                ✨ {char.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="hud-right">
        <div className="hud-value">SCORE {currentScore.toLocaleString()}</div>
        <button className="audio-toggle-btn" onClick={onToggleAudio} title="Toggle Audio Sound FX">
          {isMuted ? '🔇' : '🎵'}
        </button>
      </div>
    </div>
  );
}
