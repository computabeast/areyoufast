"use client"

interface RunningSpriteProps {
  size?: number;
}

export default function RunningSprite({ size = 64 }: RunningSpriteProps) {
  // Sprite sheet is 3 columns x 2 rows
  const cols = 3;
  const rows = 2;
  
  return (
    <div 
      className="runner"
      style={{
        '--frame-size': `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: 'pixelated',
        backgroundImage: 'url("/images/spritesheet1.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${size * cols}px ${size * rows}px`,
      } as React.CSSProperties}
    />
  );
}

