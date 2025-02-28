import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Clock, CalendarIcon, CirclePlus } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Hardcoded task options with colors
const TASK_OPTIONS = [
  { value: "Development", label: "Development", color: "bg-violet-100 text-violet-800 border-violet-200" },
  { value: "Testing", label: "Testing", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "Meeting", label: "Meeting", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "Documentation", label: "Documentation", color: "bg-sky-100 text-sky-800 border-sky-200" },
  { value: "Planning", label: "Planning", color: "bg-pink-100 text-pink-800 border-pink-200" },
  { value: "Learning", label: "Learning", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { value: "Code Review", label: "Code Review", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "Design", label: "Design", color: "bg-teal-100 text-teal-800 border-teal-200" },
];

interface TimesheetEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  task: string;
  hours: string;
  desc: string;
}

export default function Timesheet() {
  const [events, setEvents] = useState<TimesheetEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<View>("month");

  const handleSelectSlot = ({ start }: { start: Date }) => {
    // Check if the date is a weekend or not in current month
    const isWeekend = start.getDay() === 0 || start.getDay() === 6;
    const isCurrentMonth = start.getMonth() === new Date().getMonth();

    if (!isWeekend && isCurrentMonth) {
      setSelectedDate(start);
      setTask("");
      setHours("");
      setDescription("");
      setEditingId(null);
    }
  };

  const handleSelectEvent = (event: TimesheetEvent) => {
    setSelectedDate(event.start);
    setTask(event.task);
    setHours(event.hours);
    setDescription(event.desc);
    setEditingId(event.id);
  };

  const handleSaveEntry = () => {
    if (!selectedDate || !task || !hours.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const hourNum = parseFloat(hours);
    if (isNaN(hourNum) || hourNum <= 0 || hourNum > 24) {
      toast.error("Please enter a valid number of hours (1-24)");
      return;
    }

    const newEvent: TimesheetEvent = {
      id: editingId || crypto.randomUUID(),
      title: `${task}: ${hours} hrs`,
      start: selectedDate,
      end: selectedDate,
      task,
      hours,
      desc: description,
    };

    if (editingId) {
      // Editing existing entry
      const updatedEvents = events.map(event =>
        event.id === editingId ? newEvent : event
      );
      setEvents(updatedEvents);
      toast.success("Timesheet entry updated");
    } else {
      // Adding new entry
      setEvents([...events, newEvent]);
      toast.success("Timesheet entry added");
    }

    setSelectedDate(null);
    setTask("");
    setHours("");
    setDescription("");
    setEditingId(null);
  };

  const handleViewChange = (view: View) => {
    setViewMode(view);
  };

  // Get task color class
  const getTaskColor = (taskName: string) => {
    const taskOption = TASK_OPTIONS.find(opt => opt.value === taskName);
    return taskOption?.color || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    return (
      <div className="flex justify-between items-center mb-4 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToBack}
            className="transition-transform hover:translate-x-[-2px] border-indigo-200 hover:bg-indigo-100"
          >
            <ChevronLeft className="h-4 w-4 text-indigo-700" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="transition-transform hover:translate-x-[2px] border-indigo-200 hover:bg-indigo-100"
          >
            <ChevronRight className="h-4 w-4 text-indigo-700" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrent}
            className="ml-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Today
          </Button>
        </div>

        <h2 className="text-lg font-medium text-center flex-1 text-indigo-900">
          {toolbar.label}
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'month' ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange('month')}
            className="text-sm font-medium"
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'year' ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange('year')}
            className="text-sm font-medium"
          >
            Year
          </Button>
        </div>
      </div>
    );
  };

  // Custom event component
  const EventComponent = ({ event }: { event: TimesheetEvent }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "px-2 py-1 rounded-sm border text-sm max-w-full overflow-hidden whitespace-nowrap text-ellipsis transition-all",
                getTaskColor(event.task)
              )}
            >
              <div className="font-medium flex items-center justify-between">
                <span>{event.task}</span>
              </div>
              <div className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.hours} hrs
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-4 max-w-xs bg-white border border-indigo-100 shadow-lg">
            <div>
              <div className="font-bold mb-1 flex items-center justify-between">
                {event.task}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {format(event.start, "PPPP")} · {event.hours} hours
              </div>
              <div className="text-sm mt-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                <p className="text-sm">{event.desc}</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Custom day cell component
  const DayCell = ({ date }: { date: Date }) => {
    const hasEntries = events.some(event =>
      format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isCurrentMonth = date.getMonth() === new Date().getMonth();

    if (isWeekend || !isCurrentMonth) {
      return (
        <div className="h-full w-full flex items-center justify-center opacity-50 bg-gray-50">
          <span className="text-gray-400">{format(date, 'd')}</span>
        </div>
      );
    }

    return (
      <div className="relative h-full w-full p-1">
        <span>{format(date, 'd')}</span>
        {!hasEntries && isCurrentMonth && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-0 right-0 h-6 w-6 p-1 hover:bg-indigo-100"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectSlot({ start: date });
              }}
            />
            <CirclePlus className="h-4 w-4 text-blue-600 absolute left-1 top-1" />
          </>
        )}
      </div>
    );
  };

  // Update the customComponents object
  const customComponents = {
    event: EventComponent,
    toolbar: CustomToolbar,
    month: {
      event: EventComponent,
      dateHeader: (props: { date: Date }) => (
        <DayCell date={props.date} />
      )
    },
    year: {
      event: EventComponent
    }
  };

  return (
    <Card className="w-full shadow-lg animate-fade-in overflow-hidden border-indigo-100">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900">Timesheet Calendar</CardTitle>
            <CardDescription className="text-indigo-700">
              Track your work hours and activities
            </CardDescription>
          </div>
          <Button
            onClick={() => setSelectedDate(new Date())}
            className="group self-start sm:self-center bg-indigo-600 hover:bg-indigo-700"
          >
            <CalendarIcon className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Add Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-white rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-md border-indigo-100">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            view={viewMode}
            onView={handleViewChange}
            views={['month', 'year']}
            components={customComponents}
            className="timesheet-calendar"
            firstDayOfWeek={1} // Start week from Monday
            // Disable weekend and non-current month selection
            dayPropGetter={(date) => {
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const isCurrentMonth = date.getMonth() === new Date().getMonth();

              return {
                style: {
                  backgroundColor: (isWeekend || !isCurrentMonth) ? '#f8fafc' : undefined,
                  cursor: (isWeekend || !isCurrentMonth) ? 'not-allowed' : 'pointer',
                  opacity: !isCurrentMonth ? '0.5' : '1'
                },
                className: (isWeekend || !isCurrentMonth) ? 'disabled-day' : undefined
              };
            }}
          />
        </div>

        <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingId ? "Edit Timesheet Entry" : "New Timesheet Entry"}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                {selectedDate ? format(selectedDate, "PPPP") : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-type">Task Type</Label>
                <Select value={task} onValueChange={setTask}>
                  <SelectTrigger id="task-type">
                    <SelectValue placeholder="Select a task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("py-0.5 px-1.5", option.color)}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hours">Hours Worked</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  placeholder="Hours worked"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you worked on..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDate(null)}>
                Close
              </Button>

              <Button onClick={handleSaveEntry} className="ml-2 bg-indigo-600 hover:bg-indigo-700">
                {editingId ? "Update Entry" : "Save Entry"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}