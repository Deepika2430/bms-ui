import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TASK_OPTIONS = ["Development", "Testing", "Meeting", "Documentation"];

export default function Timesheet() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setTask("");
    setHours("");
    setDescription("");
    setEditingIndex(null);
  };

  const handleSelectEvent = (event, index) => {
    setSelectedDate(event.start);
    setTask(event.task);
    setHours(event.hours);
    setDescription(event.desc);
    setEditingIndex(index);
  };

  const handleSaveEntry = () => {
    if (!selectedDate || !task || !hours.trim() || !description.trim()) return;

    const newEvent = {
      title: `${task}: ${hours} hrs`,
      start: selectedDate,
      end: selectedDate,
      task,
      hours,
      desc: description,
    };

    if (editingIndex !== null) {
      // Editing existing entry
      const updatedEvents = [...events];
      updatedEvents[editingIndex] = newEvent;
      setEvents(updatedEvents);
    } else {
      // Adding new entry
      setEvents([...events, newEvent]);
    }

    setSelectedDate(null);
    setTask("");
    setHours("");
    setDescription("");
    setEditingIndex(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Timesheet Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event, e) => handleSelectEvent(event, events.indexOf(event))}
        components={{
          event: ({ event }) => (
            <Tooltip content={event.desc}>
              <div className="cursor-pointer">{event.title}</div>
            </Tooltip>
          ),
        }}
        className="bg-white rounded-lg shadow-lg p-4"
      />

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogTrigger asChild>
          <Button className="mt-4">{editingIndex !== null ? "Edit Entry" : "Add Timesheet Entry"}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{editingIndex !== null ? "Edit Timesheet Entry" : "New Timesheet Entry"}</DialogTitle>
          <DialogDescription>{selectedDate ? format(selectedDate, "PPPP") : ""}</DialogDescription>

          <select
            className="border p-2 w-full rounded-md mt-2"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          >
            <option value="">Select a Task</option>
            {TASK_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Hours worked"
            className="border p-2 w-full rounded-md mt-2"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <textarea
            placeholder="Task description"
            className="border p-2 w-full rounded-md mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button className="mt-4" onClick={handleSaveEntry}>
            {editingIndex !== null ? "Update" : "Submit"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
