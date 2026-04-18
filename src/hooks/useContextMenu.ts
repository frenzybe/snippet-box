import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage context menu state and positioning.
 */
export function useContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setCoords({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleGlobalClick = () => closeMenu();
      window.addEventListener('click', handleGlobalClick);
      return () => window.removeEventListener('click', handleGlobalClick);
    }
  }, [isOpen, closeMenu]);

  return {
    isOpen,
    coords,
    onContextMenu,
    closeMenu
  };
}
