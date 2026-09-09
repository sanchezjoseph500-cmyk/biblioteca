export default function FormButton({ children, onClick, variant = "primary", disabled, type = "button" }) {
  const styles = {
    primary: "bg-gradient-to-r from-[#B85C38] to-[#9c4a2c] text-white hover:from-[#c96a43] hover:to-[#a95535] shadow-lg shadow-[#B85C38]/25",
    secondary: "bg-[#F4E8D0] text-[#6B4226] hover:bg-[#ece0c4] border border-[#C49A55]/40",
    danger: "bg-gradient-to-r from-rose-700 to-red-700 text-white hover:from-rose-600 hover:to-red-600",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] shadow-sm ${styles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}
