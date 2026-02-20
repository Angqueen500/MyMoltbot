import { useState, useEffect } from 'react';

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    // Wrapping in timeout to avoid potential strict-mode sync state update issues, though usually fine in useEffect
    setTimeout(() => {
        const saved = localStorage.getItem('pawconnect_bookmarks');
        if (saved) {
            setBookmarks(JSON.parse(saved));
        }
    }, 0);
  }, []);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const newBookmarks = prev.includes(id)
        ? prev.filter((b) => b !== id)
        : [...prev, id];
      localStorage.setItem('pawconnect_bookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const isBookmarked = (id: number) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}
