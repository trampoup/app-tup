export function getAvatarColor(seed: string): string {
  const name = (seed ?? '').trim();
  if (!name) return '#E0E0E0';

  const first = name[0].toUpperCase();

  const fixed: Record<string, string> = {
    M: '#FF6B6B', //isso aq é so pra sair igual ao figma
    J: '#2ECC71', 
    P: '#F2C94C', 
  };

  if (fixed[first]) return fixed[first];

  // fallback:
  const palette = ['#FF6B6B', '#2ECC71', '#F2C94C', '#56CCF2', '#BB6BD9'];

  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
}
