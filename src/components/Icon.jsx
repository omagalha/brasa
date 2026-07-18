const Icon = ({ name, size = 22, color = "currentColor" }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "flame":
      return (<svg {...p} fill={color} stroke="none"><path d="M12 2c.7 3.2-.8 4.9-2.3 6.6C8.2 10.3 7 12 7 14.5A5 5 0 0 0 12 19.5a5 5 0 0 0 5-5c0-2.2-1-3.7-2-5.2-.6 1.4-1.3 2.2-2.4 2.7.4-2.6-.1-5.4-.6-7C11.6 3.9 11.9 2.9 12 2z"/></svg>);
    case "dumbbell":
      return (<svg {...p}><path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/></svg>);
    case "heart":
      return (<svg {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/></svg>);
    case "drop":
      return (<svg {...p} fill={color} stroke="none"><path d="M12 2.7s6.5 7 6.5 11.8a6.5 6.5 0 0 1-13 0C5.5 9.7 12 2.7 12 2.7z"/></svg>);
    case "chart":
      return (<svg {...p}><path d="M3 20h18M5 16l4-5 3 3 6-8"/><circle cx="9" cy="11" r="0.5" fill={color}/></svg>);
    case "camera":
      return (<svg {...p}><path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2"/></svg>);
    case "moon":
      return (<svg {...p}><path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5z"/></svg>);
    case "menu":
      return (<svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>);
    case "bell":
      return (<svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10.5 20a1.8 1.8 0 0 0 3 0"/></svg>);
    default:
      return null;
  }
};;

export default Icon;
