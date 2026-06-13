export function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-white border rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
