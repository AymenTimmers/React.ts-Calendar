import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './Calendar/Calendar';
import Roster from './Calendar/CalendarComponents/Roster';
import AddEvent from './Calendar/CalendarComponents/AddEvent';
import EventCardDetails from './Calendar/CalendarComponents/EventCardDetails';
import { EventProvider } from './context/CalendarContext';

function App() {
  return (
    <Router>
      <EventProvider>
        <Routes>
          <Route path="/calendar" element={<Calendar/>}>
            <Route index element={<Roster />} />
            <Route path="/calendar/addevent" element={<AddEvent/>}/>
            <Route path="/calendar/event/:id" element={<EventCardDetails/>}/>
          </Route>
        </Routes>
      </EventProvider>
    </Router>
  )
}

export default App
