// lib/sanitize.ts
export const s = {
  text(v: unknown, max = 1000): string {
    let t = String(v ?? '').trim();
    t = t.replace(/[\u0000-\u001F\u007F]/g, ''); // quita control chars
    if (t.length > max) t = t.slice(0, max);
    return t;
  },
  int(v: unknown, fallback = 0): number {
    const n = Number.parseInt(String(v ?? '').trim(), 10);
    return Number.isFinite(n) ? n : fallback;
  },
  float(v: unknown, fallback = 0): number {
    const n = Number.parseFloat(String(v ?? '').replace(',', '.'));
    return Number.isFinite(n) ? n : fallback;
  },
  unit(v: unknown): 'g'|'ml'|'unit'|'' {
    const u = String(v ?? '').trim();
    return u === 'g' || u === 'ml' || u === 'unit' ? (u as any) : '';
  },
};
