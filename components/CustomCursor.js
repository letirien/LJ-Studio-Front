import { useState, useEffect } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Gestion de la visibilité via des events custom
  useEffect(() => {
    const showCursor = () => setVisible(true);
    const hideCursor = () => setVisible(false);

    window.addEventListener("cursor-show", showCursor);
    window.addEventListener("cursor-hide", hideCursor);

    return () => {
      window.removeEventListener("cursor-show", showCursor);
      window.removeEventListener("cursor-hide", hideCursor);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-opacity duration-200"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <img
        src="/images/CURSEUR_ROND_CENTRAL.svg"
        alt=""
        className="w-[120px] h-[120px] transition-transform duration-300 ease-out"
      />
    </div>
  );
}
