import { createContext, useContext, useState, ReactNode } from "react";
import { Event, EventContextType, FoodItem, Family, Assignment } from "@/types/event";

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const addEvent = (eventData: Omit<Event, "id" | "createdAt" | "status">) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      status: "draft",
      createdAt: new Date().toISOString(),
      items: [],
      families: [],
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    );
    if (currentEvent?.id === id) {
      setCurrentEvent(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const selectEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    setCurrentEvent(event || null);
  };

  const addItemToEvent = (eventId: string, itemData: Omit<FoodItem, "id">) => {
    const newItem: FoodItem = {
      ...itemData,
      id: Date.now().toString(),
    };

    updateEvent(eventId, {
      items: [...(events.find(e => e.id === eventId)?.items || []), newItem],
    });
  };

  const addFamilyToEvent = (eventId: string, familyData: Omit<Family, "id">) => {
    const newFamily: Family = {
      ...familyData,
      id: Date.now().toString(),
    };

    updateEvent(eventId, {
      families: [...(events.find(e => e.id === eventId)?.families || []), newFamily],
    });
  };

  const performDraw = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Create a pool of all needed assignments
    const assignmentPool: { itemName: string; count: number }[] = [];
    event.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        assignmentPool.push({ itemName: item.name, count: i + 1 });
      }
    });

    // Shuffle families and assignments
    const shuffledFamilies = [...event.families].sort(() => Math.random() - 0.5);
    const shuffledAssignments = [...assignmentPool].sort(() => Math.random() - 0.5);

    // Create assignments
    const assignments: Assignment[] = shuffledFamilies.map((family, index) => {
      const familyItems: string[] = [];
      const itemsPerFamily = Math.ceil(shuffledAssignments.length / shuffledFamilies.length);
      
      for (let i = 0; i < itemsPerFamily && (index * itemsPerFamily + i) < shuffledAssignments.length; i++) {
        const assignmentIndex = index * itemsPerFamily + i;
        const assignment = shuffledAssignments[assignmentIndex];
        if (assignment) {
          familyItems.push(`${assignment.itemName} (${assignment.count})`);
        }
      }

      return {
        familyId: family.id,
        familyName: family.name,
        items: familyItems,
      };
    });

    updateEvent(eventId, {
      assignments,
      status: "completed",
    });
  };

  return (
    <EventContext.Provider
      value={{
        events,
        currentEvent,
        addEvent,
        updateEvent,
        selectEvent,
        addItemToEvent,
        addFamilyToEvent,
        performDraw,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};