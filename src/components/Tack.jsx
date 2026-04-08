export default function Tack({ size = 8, style }) {
  const id = `tackGold-${size}`;
  return (
    <svg
      width={size * 2}
      height={size * 2}
      viewBox={`0 0 ${size * 2} ${size * 2}`}
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#c9a020"/>
          <stop offset="100%" stopColor="#8a6200"/>
        </radialGradient>
      </defs>
      <circle
        cx={size}
        cy={size}
        r={size}
        fill={`url(#${id})`}
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.25))"
      />
    </svg>
  );
}
