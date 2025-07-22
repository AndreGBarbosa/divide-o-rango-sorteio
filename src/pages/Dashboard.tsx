import { Plus, Calendar, Users, Utensils } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { useEventContext } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-food-sharing.jpg";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { events, addEvent, selectEvent } = useEventContext();
  const navigate = useNavigate();

  const handleSelectEvent = (eventId: string) => {
    selectEvent(eventId);
    navigate(`/event/${eventId}`);
  };

  const getEventStats = () => {
    return {
      total: events.length,
      completed: events.filter(e => e.status === "completed").length,
      totalFamilies: events.reduce((sum, e) => sum + e.families.length, 0),
      totalItems: events.reduce((sum, e) => sum + e.items.length, 0),
    };
  };

  const stats = getEventStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/5">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Divide o Rango
              </h1>
              <p className="text-muted-foreground text-sm">Organize e sorteie quem leva o quê!</p>
            </div>
            <CreateEventDialog onCreateEvent={addEvent} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {events.length === 0 ? (
          // Empty State
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl mb-8 shadow-xl">
              <img 
                src={heroImage} 
                alt="Compartilhamento de comida" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Divide o Rango!</h2>
                <p className="text-sm opacity-90">Organize eventos e sorteie quem leva cada item</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-foreground">Como funciona?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">1. Crie um evento</h4>
                  <p className="text-muted-foreground">Defina o nome e data do seu evento</p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3">
                    <Utensils className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <h4 className="font-medium mb-2">2. Adicione itens</h4>
                  <p className="text-muted-foreground">Liste os itens e quantas famílias devem levar cada um</p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <h4 className="font-medium mb-2">3. Sorteie</h4>
                  <p className="text-muted-foreground">Cadastre as famílias e deixe o app sortear automaticamente</p>
                </div>
              </div>
            </div>

            <CreateEventDialog onCreateEvent={addEvent} />
          </div>
        ) : (
          // Events Dashboard
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Eventos</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-success">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Sorteados</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-accent">{stats.totalFamilies}</div>
                <div className="text-sm text-muted-foreground">Famílias</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-secondary-foreground">{stats.totalItems}</div>
                <div className="text-sm text-muted-foreground">Itens</div>
              </div>
            </div>

            {/* Events Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Seus Eventos</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={new Date(event.date).toLocaleDateString('pt-BR')}
                    totalFamilies={event.families.length}
                    totalItems={event.items.length}
                    status={event.status}
                    onSelect={() => handleSelectEvent(event.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};