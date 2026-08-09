import React from 'react';

export function HUD({ currentScore, playerHp, maxHp, rescuedList, isMuted, onToggleAudio }) {
  // Render health hearts
  const hearts = [];
  for (let i = 0; i < maxHp; i++) {
    hearts.push(
      <span key={i} className={`hp-heart ${i < playerHp ? 'active' : 'empty'}`}>
        {i < playerHp ? '❤️' : '🖤'}
      </span>
    );
  }

  return (
    <div className="game-hud">
      <div className="hud-card">
        <div className="hud-label">HERO HEALTH</div>
        <div className="hud-hearts">{hearts}</div>
      </div>

      <div className="hud-card">
        <div className="hud-label">RESCUED PARTY</div>
        <div className="party-badges">
          {rescuedList.length === 0 ? (
            <span className="party-empty">Break prison cages to recruit allies!</span>
          ) : (
            rescuedList.map((char) => (
              <div key={char.id} className="party-badge" style={{ borderColor: char.color }}>
                <span className="badge-name">{char.name}</span>
                <span className="badge-power">✨ {char.power}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="hud-card score-card">
        <div className="hud-label">SCORE</div>
        <div className="hud-value">{currentScore.toLocaleString()}</div>
      </div>

      <div className="hud-actions" style={{ display: 'flex', gap: '8px' }}>
        <button className="audio-toggle-btn" onClick={onToggleAudio} title="Toggle Audio Sound FX">
          {isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON'}
        </button>
        <button className="audio-toggle-btn" style={{ borderColor: '#ffd13b', color: '#ffd13b' }} onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' }))} title="Cheat: Instant Victory">
          ⚡ INSTANT WIN
        </button>
      </div>
    </div>
  );
}
