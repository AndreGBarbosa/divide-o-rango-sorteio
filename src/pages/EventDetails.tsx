import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, Utensils, Shuffle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEventContext } from "@/contexts/EventContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, currentEvent, selectEvent, addItemToEvent, addFamilyToEvent, performDraw } = useEventContext();
  const { toast } = useToast();

  // States for dialogs
  const [itemDialog, setItemDialog] = useState(false);
  const [familyDialog, setFamilyDialog] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [familyName, setFamilyName] = useState("");
  const [familyContact, setFamilyContact] = useState("");

  // Get current event
  const event = currentEvent || events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const handleAddItem = () => {
    if (!itemName.trim() || itemQuantity < 1) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    addItemToEvent(event.id, {
      name: itemName.trim(),
      quantity: itemQuantity,
    });

    setItemName("");
    setItemQuantity(1);
    setItemDialog(false);
    
    toast({
      title: "Item adicionado!",
      description: `${itemQuantity}x ${itemName} adicionado ao evento.`,
    });
  };

  const handleAddFamily = () => {
    if (!familyName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome da família.",
        variant: "destructive",
      });
      return;
    }

    addFamilyToEvent(event.id, {
      name: familyName.trim(),
      contact: familyContact.trim() || undefined,
    });

    setFamilyName("");
    setFamilyContact("");
    setFamilyDialog(false);
    
    toast({
      title: "Família adicionada!",
      description: `${familyName} foi adicionada ao evento.`,
    });
  };

  const handlePerformDraw = () => {
    if (event.items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item antes de sortear.",
        variant: "destructive",
      });
      return;
    }

    if (event.families.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma família antes de sortear.",
        variant: "destructive",
      });
      return;
    }

    performDraw(event.id);
    
    toast({
      title: "Sorteio realizado!",
      description: "O sorteio foi realizado com sucesso. Confira os resultados abaixo.",
    });
  };

  const totalItemsNeeded = event.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/5">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
              <p className="text-muted-foreground">
                {new Date(event.date).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {event.status === "ready" && (
              <Button 
                onClick={handlePerformDraw}
                className="bg-gradient-to-r from-success to-accent hover:shadow-lg"
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Sortear Agora
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {event.status === "completed" && event.assignments ? (
          // Results View
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-success/10 text-success-foreground px-4 py-2 rounded-full mb-4">
                <Trophy className="h-5 w-5" />
                Sorteio Realizado!
              </div>
              <h2 className="text-xl font-semibold mb-2">Resultado do Sorteio</h2>
              <p className="text-muted-foreground">Confira quem vai levar cada item:</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.assignments.map(assignment => (
                <Card key={assignment.familyId} className="border-2 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{assignment.familyName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {assignment.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-2 rounded"
                        >
                          <Utensils className="h-4 w-4 text-primary" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Setup View
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Items Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Itens Necessários
                </h2>
                <Dialog open={itemDialog} onOpenChange={setItemDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Item</DialogTitle>
                      <DialogDescription>
                        Defina o item e quantas famílias devem levá-lo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="itemName">Nome do Item</Label>
                        <Input
                          id="itemName"
                          placeholder="Ex: Batata, Molho, Refrigerante..."
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="itemQuantity">Quantas famílias devem levar?</Label>
                        <Input
                          id="itemQuantity"
                          type="number"
                          min="1"
                          value={itemQuantity}
                          onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setItemDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddItem}>Adicionar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {event.items.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="text-center py-8">
                      <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum item adicionado ainda</p>
                      <p className="text-sm text-muted-foreground">Clique em "Adicionar Item" para começar</p>
                    </CardContent>
                  </Card>
                ) : (
                  event.items.map(item => (
                    <Card key={item.id}>
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Utensils className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} {item.quantity === 1 ? 'família' : 'famílias'}
                            </p>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {item.quantity}x
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Families Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Famílias Participantes
                </h2>
                <Dialog open={familyDialog} onOpenChange={setFamilyDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Família
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Família</DialogTitle>
                      <DialogDescription>
                        Cadastre uma família para participar do evento.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="familyName">Nome da Família</Label>
                        <Input
                          id="familyName"
                          placeholder="Ex: Família Silva, João e Maria..."
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="familyContact">Contato (opcional)</Label>
                        <Input
                          id="familyContact"
                          placeholder="WhatsApp, telefone..."
                          value={familyContact}
                          onChange={(e) => setFamilyContact(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setFamilyDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddFamily}>Adicionar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {event.families.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhuma família cadastrada ainda</p>
                      <p className="text-sm text-muted-foreground">Clique em "Adicionar Família" para começar</p>
                    </CardContent>
                  </Card>
                ) : (
                  event.families.map(family => (
                    <Card key={family.id}>
                      <CardContent className="flex items-center gap-3 py-4">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{family.name}</p>
                          {family.contact && (
                            <p className="text-sm text-muted-foreground">{family.contact}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        {event.status !== "completed" && (
          <Card className="mt-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Resumo do Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{event.items.length}</div>
                  <div className="text-sm text-muted-foreground">Tipos de item</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary-foreground">{totalItemsNeeded}</div>
                  <div className="text-sm text-muted-foreground">Total necessário</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{event.families.length}</div>
                  <div className="text-sm text-muted-foreground">Famílias</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    event.families.length >= totalItemsNeeded ? 'text-success' : 'text-destructive'
                  }`}>
                    {event.families.length >= totalItemsNeeded ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {event.families.length >= totalItemsNeeded ? 'Pronto!' : 'Faltam famílias'}
                  </div>
                </div>
              </div>
              
              {event.families.length >= totalItemsNeeded && event.items.length > 0 && (
                <div className="mt-6 text-center">
                  <p className="text-success mb-4">Tudo pronto para o sorteio! 🎉</p>
                  <Button 
                    onClick={handlePerformDraw}
                    size="lg"
                    className="bg-gradient-to-r from-success to-accent hover:shadow-lg"
                  >
                    <Shuffle className="mr-2 h-5 w-5" />
                    Realizar Sorteio
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};