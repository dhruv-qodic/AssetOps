/**
 * @description Shared string manipulation utilities
 */

/**
 * Extracts a 2-character uppercase initials string from a name.
 * Handles single names, multi-word names, and fallbacks.
 *
 * @param {string} name - Full name string
 * @param {string} fallback - Default fallback if name is empty (default: 'UN')
 * @returns {string} 2-character uppercase initials
 */
export function getInitials(name?: string | null, fallback = 'UN'): string {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
