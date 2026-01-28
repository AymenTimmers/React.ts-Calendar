import React, { createContext, useContext, useState } from 'react';
import type { CalendarEvent } from '../../interfaces/CalendarTypes';
import { DateHelper } from '../../calendar/DateHelper'
import { useAuth } from './AuthContext';
import type { EventContextType } from '../../interfaces/CalendarTypes';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5108";
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const userId = auth.user?.id;
    if(!userId) {
        setError("User not authenticated");
        return;
    }

    //Prevents the date from shifting to the previous day by
    //Forcing toISOString to use local time instead of UTC.
    const toLocalISO = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    }

    //FETCH EVENTS FROM API FOR GIVEN DATES
    const refreshEvents = async (week: number, year: number) => {
        setLoading(true);
        try{
            const daysOfWeek = DateHelper.getDaysOfWeek(week, year);
            const start = toLocalISO(daysOfWeek[0]);
            const end = toLocalISO(daysOfWeek[6]);

            const response = await fetch(`${API_BASE}/calendar?userId=${userId}&start=${start}&end=${end}`);

            if(!response.ok) {
                throw new Error("Failed to refresh events");
            }

            const jsonData = await response.json();

            if(Array.isArray(jsonData)) {
                setEvents(jsonData);
            }
        }catch (error) {
            setError("Failed to fetch events");
        } finally {
            setLoading(false);
            }
        };

    //POST SENDS NEW EVENTS TO API
    const saveEvent = async (newEvent: CalendarEvent) => {
        const response = await fetch(`${API_BASE}/calendar?userId=${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(newEvent),
        });

        if (!response.ok) throw new Error("Failed to create event");
        
        const savedEventFromAPI = await response.json();

        //REFRESH LOCAL STATE SO UI UPDATES IMMEDIATLY WITHOUT RELOADING
        setEvents((prev) => {
            if (prev.some(event => event.id === savedEventFromAPI.id)) {
                return prev;
            }
            return [...prev, savedEventFromAPI];
        });
    }

    //DELETE THAT DELETES THE EVENT FOR ID
    const deleteEvent = async (calendarId: number) => {
        const response = await fetch(`${API_BASE}/calendar/${calendarId}?userId=${userId}`, {
            method: "DELETE",
        })
        if (!response.ok) {
            throw new Error("Failed to delete event");
        }
        
        //UPDATE STATE
        setEvents((prev) => prev.filter(event => event.id !== calendarId));
    };

    //PUT THAT UPDATES EVENT
    const updateEvent = async (updatedCalendar: CalendarEvent) => {
        const response = await fetch(`${API_BASE}/calendar/${updatedCalendar.id}?userId=${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedCalendar)
        });

        if(!response.ok) {
            throw new Error("Failed to updated ")
        }
        
        const updatedEventFromAPI = await response.json();

        setEvents((prev) => prev.map(event => event.id === updatedEventFromAPI.id ? updatedEventFromAPI : event));
    }

    const getEventById = (id: string | number | undefined) => {
        const numericId = typeof id == 'string' ? Number(id) : id;
        return events.find(event => event.id === numericId);
    };

  return (
    <EventContext.Provider value={{ events, loading, error, saveEvent: saveEvent, refreshEvents, getEventById, deleteEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
};

// A custom hook for easy access to the context data
export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) throw new Error("useEvents must be used within an EventProvider");
    return context;
};
