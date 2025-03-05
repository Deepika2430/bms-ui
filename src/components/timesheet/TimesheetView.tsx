import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarIcon, CirclePlus, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { getWorkLogs, addWorkLog, WorkLog } from '@/services/workLogsService';
import { TimesheetDialog } from './TimesheetDialog';
import { TimesheetEventComponent } from './TimesheetEventComponent';
import { DayCellComponent } from './DayCellComponent';
import { CustomToolbar } from './CustomToolbar';
import { WorkLogDetailsDialog } from './WorkLogDetailsDialog';

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface WorkLogTask {
  id: string;
  title: string;
  description: string;
  project_id: string;
  status: string;
}

interface WorkLogData {
  id: string;
  user_id: string;
  project_id: string;
  task_id: string;
  tasks: WorkLogTask;
  work_date: string;
  hours_worked: string;
  notes: string;
  comments: string;
  status: string;
}

interface TimesheetViewProps {
  userId: string;
  readOnly?: boolean;
  onApprove?: (weekData: any) => void;
  onReject?: (weekData: any) => void;
  assignedTasks?: any[];
  initialWorkLogs?: any[];
}

export default function TimesheetView({
  userId,
  readOnly = false,
  onApprove,
  onReject,
  assignedTasks = [],
  initialWorkLogs = [],
  style = {}
}: TimesheetViewProps) {
  const [workLogs, setWorkLogs] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<View>("month");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedWorkLog, setSelectedWorkLog] = useState(null);

  useEffect(() => {
    if (initialWorkLogs && initialWorkLogs.length > 0) {
      // Convert logs to calendar events
      const calendarEvents = initialWorkLogs
        .map((log: WorkLogData) => {
          const workDate = new Date(log.work_date);
          if (isNaN(workDate.getTime())) return null;

          return {
            id: log.id,
            title: log.tasks.title,
            start: workDate,
            end: workDate,
            task: log.task_id,
            hours: log.hours_worked,
            desc: log.notes,
            projectId: log.project_id,
            status: log.status.toLowerCase(),
            taskName: log.tasks.title,
            taskDescription: log.tasks.description,
            taskStatus: log.tasks.status
          };
        })
        .filter(Boolean);

      setWorkLogs(calendarEvents);
    } else {
      fetchWorkLogs();
    }
  }, [userId]);

  const fetchWorkLogs = async () => {
    try {
      setLoading(true);
      const logs = await getWorkLogs();

      // Convert logs to calendar events
      const calendarEvents = logs
        .map((log: WorkLogData) => {
          const workDate = new Date(log.work_date);
          if (isNaN(workDate.getTime())) return null;

          return {
            id: log.id,
            title: log.tasks.title,
            start: workDate,
            end: workDate,
            task: log.task_id,
            hours: log.hours_worked,
            desc: log.notes,
            projectId: log.project_id,
            status: log.status.toLowerCase(),
            taskName: log.tasks.title,
            taskDescription: log.tasks.description,
            taskStatus: log.tasks.status
          };
        })
        .filter(Boolean);

      setWorkLogs(calendarEvents);
    } catch (error) {
      console.error('Error fetching work logs:', error);
      toast.error('Failed to load timesheet entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const isWeekend = start.getDay() === 0 || start.getDay() === 6;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isFutureDate = start > today;
    const isCurrentViewMonth = start.getMonth() === currentViewDate.getMonth() &&
                             start.getFullYear() === currentViewDate.getFullYear();

    if (!isWeekend && !isFutureDate && isCurrentViewMonth && !readOnly) {
      setSelectedDate(start);
      setEditingId(null);
    }
  };

  const handleSelectEvent = (event: any) => {
    if (readOnly) {
      setSelectedWorkLog(event);
    } else {
      setSelectedDate(event.start);
      setEditingId(event.id);
    }
  };

  const handleSaveEntry = async (formData: any) => {
    try {
      if (editingId) {
        // Handle update
        await addWorkLog({ ...formData, id: editingId });
        toast.success('Timesheet entry updated successfully');
      } else {
        // Handle create
        await addWorkLog(formData);
        toast.success('Timesheet entry added successfully');
      }
      setSelectedDate(null);
      setEditingId(null);
      fetchWorkLogs();
    } catch (error) {
      console.error('Error saving work log:', error);
      toast.error('Failed to save timesheet entry');
    }
  };

  const customComponents = {
    event: (props: any) => (
      <TimesheetEventComponent
        {...props}
        assignedTasks={assignedTasks}
        readOnly={readOnly}
      />
    ),
    toolbar: CustomToolbar,
    month: {
      dateHeader: (props: any) => (
        <DayCellComponent
          {...props}
          workLogs={workLogs}
          onAddEntry={handleSelectSlot}
          readOnly={readOnly}
          currentViewDate={currentViewDate}
        />
      )
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={calendarRef}
        tabIndex={-1}
        className="bg-white rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-md border-indigo-100"
      >
        <Calendar
          localizer={localizer}
          events={workLogs}
          startAccessor="start"
          endAccessor="end"
          style={{ ...(style || {}), height: style?.height || 550 }}
          selectable={!readOnly}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          view={viewMode}
          onView={(view) => setViewMode(view)}
          views={['month']}
          components={customComponents}
          className="timesheet-calendar"
          firstDayOfWeek={1}
          onNavigate={(date) => setCurrentViewDate(date)}
          date={currentViewDate}
        />
      </div>

      {readOnly ? (
        <WorkLogDetailsDialog
          open={!!selectedWorkLog}
          onOpenChange={(open) => !open && setSelectedWorkLog(null)}
          workLog={selectedWorkLog}
          onApprove={onApprove}
          onReject={onReject}
        />
      ) : (
        <TimesheetDialog
          open={!!selectedDate}
          onOpenChange={(open) => !open && setSelectedDate(null)}
          date={selectedDate}
          editingId={editingId}
          assignedTasks={assignedTasks}
          onSave={handleSaveEntry}
          workLogs={workLogs}
        />
      )}
    </div>
  );
}