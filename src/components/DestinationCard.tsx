import { Card } from "@/components/ui/card";

interface DestinationCardProps {
  name: string;
  image: string;
  onClick?: () => void;
  selected?: boolean;
}

const DestinationCard = ({ name, image, onClick, selected = false }: DestinationCardProps) => {
  return (
    <Card onClick={onClick} className={`group relative overflow-hidden rounded-2xl border-none shadow-lg transition-all duration-300 cursor-pointer min-w-[220px] h-[240px] ${selected ? 'ring-4 ring-primary/50' : ''}`}>
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={name}
          className="dest-card-img w-full h-full object-cover group-hover:scale-110"
        />
        <div className="absolute inset-0 dest-card-overlay bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-lg font-semibold drop-shadow">{name}</h3>
      </div>
    </Card>
  );
};

export default DestinationCard;
