const EarthIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-8 h-8 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="e-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
        <stop offset="100%" stopColor="#8b5cf6" /> {/* purple-600 */}
      </linearGradient>
      <linearGradient id="spark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" /> {/* pink-500 */}
        <stop offset="100%" stopColor="#d946ef" /> {/* fuchsia-500 */}
      </linearGradient>
    </defs>
    <path
      d="M15 4H9C6.23858 4 4 6.23858 4 9V15C4 17.7614 6.23858 20 9 20H15"
      stroke="url(#e-gradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12H4"
      stroke="url(#e-gradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 7.5L18 9L16.5 9.5L18 10L18.5 11.5L19 10L20.5 9.5L19 9L18.5 7.5Z"
      fill="url(#spark-gradient)"
    />
  </svg>
);

export default EarthIcon;
