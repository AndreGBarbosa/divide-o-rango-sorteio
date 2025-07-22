export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  assignedFamilies?: string[];
}

export interface Family {
  id: string;
  name: string;
  contact?: string;
}

export interface Assignment {
  familyId: string;
  familyName: string;
  items: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  items: FoodItem[];
  families: Family[];
  assignments?: Assignment[];
  status: "draft" | "ready" | "completed";
  createdAt: string;
}

export interface EventContextType {
  events: Event[];
  currentEvent: Event | null;
  addEvent: (event: Omit<Event, "id" | "createdAt" | "status">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  selectEvent: (id: string) => void;
  addItemToEvent: (eventId: string, item: Omit<FoodItem, "id">) => void;
  addFamilyToEvent: (eventId: string, family: Omit<Family, "id">) => void;
  performDraw: (eventId: string) => void;
}