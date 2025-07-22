import { Calendar, Users, Utensils } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  totalFamilies: number;
  totalItems: number;
  status: "draft" | "ready" | "completed";
  onSelect: () => void;
}

export const EventCard = ({ title, date, totalFamilies, totalItems, status, onSelect }: EventCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "draft": return "border-muted";
      case "ready": return "border-primary";
      case "completed": return "border-success";
      default: return "border-muted";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "draft": return "Rascunho";
      case "ready": return "Pronto para sortear";
      case "completed": return "Sorteado";
      default: return "Rascunho";
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${getStatusColor()} border-2`} onClick={onSelect}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Calendar size={14} />
          {date}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users size={14} />
            {totalFamilies} famílias
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Utensils size={14} />
            {totalItems} itens
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === "completed" ? "bg-success/10 text-success-foreground" :
            status === "ready" ? "bg-primary/10 text-primary-foreground" : 
            "bg-muted text-muted-foreground"
          }`}>
            {getStatusText()}
          </span>
          <Button variant="outline" size="sm" className="text-xs">
            {status === "completed" ? "Ver resultado" : "Editar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};