export const randomGradient = () => {
  const colors = [
    "bg-gradient-to-br from-violet-500 to-purple-600",
    "bg-gradient-to-br from-emerald-500 to-green-600",
    "bg-gradient-to-br from-blue-500 to-indigo-600",
    "bg-gradient-to-br from-rose-500 to-pink-600",
    "bg-gradient-to-br from-amber-500 to-orange-600",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
