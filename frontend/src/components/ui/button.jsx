export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}) {
  const baseStyle =
    "inline-flex items-center justify-center font-medium transition rounded-md disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
