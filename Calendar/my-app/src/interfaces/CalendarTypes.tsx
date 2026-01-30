export interface CalendarEvent {
            id: number;
            userId: number;
            title: string;
            description: string;
            location: string;
            date: string;
            startTime: string;
            endTime: string;
}

export interface ProfileBarProps {
  yearNumber: number;
  monthNumber: number;
  weekNumber: number;
  handlePreviousWeek: () => void;
  handleNextWeek: () => void;
  openAddEvent: () => void;
  closeAddEvent: () => void;
  isAddingEvent: boolean;
  onDateSelect: (date: Date) => void;
}

export interface WeekDay {
  Id: number;
  Name: string;
  date: Date;
}

export interface RosterProps {
    days: {Id: number; date: Date }[];
    events: CalendarEvent[];
    selectEvent: (eventData: CalendarEvent) => void;
    isViewingEvent: boolean;
    selectedEvent: CalendarEvent | null;
}

export interface EventCardProps {
  name: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  weekDayid?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
  isViewingEvent?: boolean;
}

export interface EventContextType {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  saveEvent: (event: CalendarEvent) => Promise<void>;
  refreshEvents: (week: number, year: number) => Promise<void>;
  getEventById: (id: number | undefined) => CalendarEvent | undefined;
  deleteEvent: (calendarId: number) => Promise<void>;
  updateEvent: (updatedCalendar: CalendarEvent) => Promise<void>;
}

export interface EditingEventProps {
  event: CalendarEvent;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  updateEvent: (updatedCalendar: CalendarEvent) => Promise<void>;
}
