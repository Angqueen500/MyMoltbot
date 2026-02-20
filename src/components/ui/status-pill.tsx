import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  REPORTED: { label: "Reported", variant: "default", className: "bg-blue-600 hover:bg-blue-700" },
  IN_REVIEW: { label: "In Review", variant: "secondary", className: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
  RESCUED: { label: "Rescued", variant: "default", className: "bg-green-600 hover:bg-green-700" },
  REUNITED: { label: "Reunited", variant: "default", className: "bg-purple-600 hover:bg-purple-700" },
  open: { label: "Open", variant: "secondary", className: "bg-gray-100 text-gray-800" }, // legacy
};

// Map custom variants to valid badge variants
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export default function StatusPill({ status, className }: { status: string, className?: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary", className: "bg-gray-100 text-gray-800" };

  return (
    <Badge variant={config.variant as BadgeVariant} className={cn("px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm", config.className, className)}>
      {config.label}
    </Badge>
  );
}
