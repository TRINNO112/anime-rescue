// Master list of all rescue-able companions matching README specs
export const CHARACTERS = [
  { id: 'muichiro', name: 'Muichiro Tokito', power: 'Air Double Jump', color: '#8ecae6', hairColor: '#1a1a2e', hairTip: '#80ed99' },
  { id: 'chuuya', name: 'Chuuya Nakahara', power: 'Gravity Float', color: '#fb8500', hairColor: '#d66800', hairTip: '#d66800' },
  { id: 'yuta', name: 'Yuta Okkotsu', power: 'Cursed Slash', color: '#e0b1cb', hairColor: '#4f5d75', hairTip: '#4f5d75' },
  { id: 'giyu', name: 'Giyu Tomioka', power: 'Water Shield', color: '#219ebc', hairColor: '#121212', hairTip: '#121212' }
];

// Level Platforms Config
export const platforms = [
  // Ground level platforms
  { x: 0, y: 460, w: 900, h: 50 },
  { x: 1000, y: 460, w: 1200, h: 50 },
  { x: 2300, y: 460, w: 1000, h: 50 },
  { x: 3400, y: 460, w: 1500, h: 50 },
  
  // Floating level 1
  { x: 300, y: 350, w: 200, h: 36 },
  { x: 600, y: 260, w: 250, h: 36 },
  { x: 1100, y: 330, w: 220, h: 36 },
  { x: 1400, y: 240, w: 250, h: 36 },
  { x: 1750, y: 320, w: 220, h: 36 },
  
  // Higher level platforms
  { x: 750, y: 150, w: 150, h: 36 },
  { x: 1250, y: 180, w: 180, h: 36 },
  
  // Boss arena ground
  { x: 3500, y: 460, w: 1000, h: 50 }
];

// Initial Prison Cages Config (Locked in cells!)
export const initialCages = [
  { x: 400, y: 300, w: 50, h: 60, charId: 'muichiro', rescued: false },
  { x: 800, y: 210, w: 50, h: 60, charId: 'chuuya', rescued: false },
  { x: 1850, y: 270, w: 50, h: 60, charId: 'yuta', rescued: false },
  { x: 2450, y: 410, w: 50, h: 60, charId: 'giyu', rescued: false }
];

// Level Enemies Config
export const initialEnemies = [
  { id: 1, type: 'hellhound', x: 450, y: 380, basePatrolX: 450, range: 120, speed: 1.5, height: 40, width: 50, health: 2, vy: 0, onGround: true },
  { id: 2, type: 'fireskull', x: 700, y: 220, basePatrolX: 700, range: 100, speed: 1.2, height: 40, width: 40, health: 2, vy: 0, onGround: true },
  { id: 3, type: 'werewolf', x: 1200, y: 242, basePatrolX: 1200, range: 80, speed: 1.8, height: 48, width: 48, health: 2, vy: 0, onGround: true },
  { id: 4, type: 'hellhound', x: 1550, y: 380, basePatrolX: 1550, range: 150, speed: 2.0, height: 40, width: 50, health: 3, vy: 0, onGround: true },
  { id: 5, type: 'werewolf', x: 2500, y: 372, basePatrolX: 2500, range: 100, speed: 1.6, height: 48, width: 48, health: 3, vy: 0, onGround: true },
  { id: 6, type: 'fireskull', x: 3000, y: 380, basePatrolX: 3000, range: 100, speed: 1.6, height: 40, width: 40, health: 3, vy: 0, onGround: true }
];
