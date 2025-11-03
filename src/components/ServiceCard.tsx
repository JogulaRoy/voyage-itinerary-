import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  color: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  iconSmall?: boolean;
  description?: string;
}

const ServiceCard = ({ icon: Icon, title, color, onClick, size = "md", iconSmall = false, description }: ServiceCardProps) => {
  const paddingClass = size === "lg" ? "p-4" : size === "sm" ? "p-2" : "p-3";
  const iconSize = iconSmall ? "w-5 h-5" : size === "lg" ? "w-10 h-10" : size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <Card onClick={onClick} className="service-wrapper group rounded-2xl border-none bg-card hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 w-full">
      <div className="flex flex-col items-start gap-3 p-6">
        <div className="flex items-center gap-4 w-full">
          <div
            className={`service-card-icon ${paddingClass} rounded-lg transition-transform duration-300 flex items-center justify-center flex-shrink-0`}
            style={{ backgroundColor: color }}
          >
            <Icon className={`${iconSize} text-white`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground/95">{title}</h3>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
