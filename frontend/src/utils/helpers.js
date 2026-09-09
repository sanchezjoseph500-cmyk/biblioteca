export function getInputClass(hasError) {
  const base = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 shadow-sm";
  if (hasError) {
    return `${base} bg-red-50/50 border-2 border-red-300 text-[#1a2520] placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200`;
  }
  return `${base} bg-white/80 border border-[#d4c9a8] text-[#1a2520] placeholder:text-[#a89f81] focus:border-[#c9a24c] focus:ring-2 focus:ring-[#c9a24c]/20 focus:bg-white`;
}

export const selectClass = getInputClass(false) + " appearance-none cursor-pointer";

export function formatDate(value) {
  return new Date(value).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

export function nextId(items, prefix) {
  const nums = items
    .map((item) => Number.parseInt(String(item.id).split("-")[1], 10))
    .filter((n) => !Number.isNaN(n));
  const base = prefix === "L" ? 1000 : prefix === "P" ? 3000 : 0;
  const max = nums.length > 0 ? Math.max(...nums) : base;
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}
