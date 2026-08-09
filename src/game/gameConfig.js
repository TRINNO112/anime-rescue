// Master list of all rescue-able companions matching README specs
export const CHARACTERS = [
  { id: 'muichiro', name: 'Muichiro Tokito', power: 'Air Double Jump', color: '#8ecae6', hairColor: '#1a1a2e', hairTip: '#80ed99' },
  { id: 'chuuya', name: 'Chuuya Nakahara', power: 'Gravity Float', color: '#fb8500', hairColor: '#d66800', hairTip: '#d66800' },
  { id: 'yuta', name: 'Yuta Okkotsu', power: 'Cursed Slash', color: '#e0b1cb', hairColor: '#4f5d75', hairTip: '#4f5d75' },
  { id: 'giyu', name: 'Giyu Tomioka', power: 'Water Shield', color: '#219ebc', hairColor: '#121212', hairTip: '#121212' }
];

// Level Platforms Config
export const platforms = [
  // Ground level platforms (Raised from 460 -> 410, height extended to 90 to reach canvas bottom)
  { x: 0, y: 410, w: 950, h: 90 },
  { x: 1000, y: 410, w: 1250, h: 90 },
  { x: 2300, y: 410, w: 1050, h: 90 },
  { x: 3400, y: 410, w: 1500, h: 90 },
  
  // Floating level 1
  { x: 300, y: 310, w: 200, h: 36 },
  { x: 600, y: 230, w: 250, h: 36 },
  { x: 1100, y: 290, w: 220, h: 36 },
  { x: 1400, y: 210, w: 250, h: 36 },
  { x: 1750, y: 280, w: 220, h: 36 },
  
  // Higher level platforms
  { x: 750, y: 130, w: 150, h: 36 },
  { x: 1250, y: 150, w: 180, h: 36 },
  
  // Boss arena ground
  { x: 3500, y: 410, w: 1000, h: 90 }
];

// Initial Prison Cages Config (Locked in cells!)
export const initialCages = [
  { x: 375, y: 260, w: 50, h: 50, charId: 'muichiro', rescued: false },
  { x: 700, y: 180, w: 50, h: 50, charId: 'chuuya', rescued: false },
  { x: 1835, y: 230, w: 50, h: 50, charId: 'yuta', rescued: false },
  { x: 2650, y: 360, w: 50, h: 50, charId: 'giyu', rescued: false }
];

// Level Enemies Config
export const initialEnemies = [
  { id: 1, type: 'hellhound', x: 450, y: 330, basePatrolX: 450, range: 120, speed: 1.5, height: 40, width: 50, health: 2, vy: 0, onGround: true },
  { id: 2, type: 'fireskull', x: 700, y: 190, basePatrolX: 700, range: 100, speed: 1.2, height: 40, width: 40, health: 2, vy: 0, onGround: true },
  { id: 3, type: 'werewolf', x: 1200, y: 192, basePatrolX: 1200, range: 80, speed: 1.8, height: 48, width: 48, health: 2, vy: 0, onGround: true },
  { id: 4, type: 'hellhound', x: 1550, y: 330, basePatrolX: 1550, range: 150, speed: 2.0, height: 40, width: 50, health: 3, vy: 0, onGround: true },
  { id: 5, type: 'werewolf', x: 2500, y: 322, basePatrolX: 2500, range: 100, speed: 1.6, height: 48, width: 48, health: 3, vy: 0, onGround: true },
  { id: 6, type: 'fireskull', x: 3000, y: 330, basePatrolX: 3000, range: 100, speed: 1.6, height: 40, width: 40, health: 3, vy: 0, onGround: true }
];
