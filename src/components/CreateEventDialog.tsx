import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreateEventDialogProps {
  onCreateEvent: (event: { title: string; date: string }) => void;
}

export const CreateEventDialog = ({ onCreateEvent }: CreateEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title.trim() || !date) {
      toast({
        title: "Ops!",
        description: "Preencha todos os campos para criar o evento.",
        variant: "destructive",
      });
      return;
    }

    onCreateEvent({ title: title.trim(), date });
    setTitle("");
    setDate("");
    setOpen(false);
    
    toast({
      title: "Evento criado!",
      description: `O evento "${title}" foi criado com sucesso.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Criar Novo Evento</DialogTitle>
          <DialogDescription>
            Crie um novo evento para organizar o compartilhamento de comida entre as famílias.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome do Evento</Label>
            <Input
              id="title"
              placeholder="Ex: Noite da Batata, Churrasco da Família..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Data do Evento</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover">
            Criar Evento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};