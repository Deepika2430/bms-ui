import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
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
import { ChevronLeft, ChevronRight, Clock, CalendarIcon, CirclePlus, CheckCircle, XCircle, User, Users, Eye } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getAssignedTasks } from "@/services/taskService";
import { getWorkLogs, addWorkLog, WorkLog, updateWorkLogStatus, getConsultantWorkLogs } from "@/services/workLogsService";
import { getDepartmentUsers } from "@/services/departmentService";
import Cookie from "js-cookie";
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getUserRoleFromToken } from "@/utils/decodeToken";
import { createNotification, sendNotification } from "@/services/notificationService";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface TimesheetEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  task: string;
  hours: string;
  desc: string;
  projectId: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TeamWorkLog extends WorkLog {
  id: string;
  user_id: string;
  user_name: string;
  task_title: string;
  project_name: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface DepartmentResponse {
  id: string;
  name: string;
  employee_details: {
    first_name: string;
    last_name: string;
    user_id: string;
  }[];
}

interface ConsultantWorkLog extends WorkLog {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-3 w-3 text-red-500" />;
    default:
      return <Clock className="h-3 w-3 text-yellow-500" />;
  }
};

export default function Timesheet() {
  const isManager = getUserRoleFromToken(Cookie.get('authToken') || '') === 'manager';

  const [personalEvents, setPersonalEvents] = useState<TimesheetEvent[]>([]);
  const [consultantEvents, setConsultantEvents] = useState<TimesheetEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<View>("month");
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [formData, setFormData] = useState({
    taskId: '',
    hours: 0,
    description: ''
  });
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const [selectedConsultant, setSelectedConsultant] = useState<string>("");

  const [selectedWorkLog, setSelectedWorkLog] = useState<ConsultantWorkLog | null>(null);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionComments, setRejectionComments] = useState("");
  const [departmentData, setDepartmentData] = useState<DepartmentResponse | null>(null);
  const [consultantWorkLogs, setConsultantWorkLogs] = useState<ConsultantWorkLog[]>([]);

  // Add refresh interval reference
  const refreshIntervalRef = React.useRef<NodeJS.Timeout>();

  // Add this state for managing the details dialog
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<TimesheetEvent | null>(null);

  // Add new state for all worklogs
  const [allConsultantWorkLogs, setAllConsultantWorkLogs] = useState<ConsultantWorkLog[]>([]);

  // Update useEffect to handle auto-refresh
  useEffect(() => {
    loadData(); // Initial load

    // Set up refresh interval (every 5 minutes)
    refreshIntervalRef.current = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []); // Empty dependency array for initial setup only

  // Add effect to reload data when month changes
  useEffect(() => {
    loadWorkLogs();
  }, [currentViewDate]);

  // Load team members for managers
  useEffect(() => {
    if (isManager) {
      loadTeamMembers();
    }
  }, [isManager]);

  useEffect(() => {
    if (isManager && selectedConsultant) {
      loadConsultantWorkLogs();
    }
  }, [isManager, selectedConsultant]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const tasks = await getAssignedTasks();
      console.log(tasks);
      setAssignedTasks(tasks);
      await loadWorkLogs();

      if (isManager) {
        await loadTeamMembers();
        // await loadTeamWorkLogs();
      }
    } catch (error) {
      console.error('Error loading assigned tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const response = await getDepartmentUsers();
      setDepartmentData(response);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Failed to load team members');
    }
  };

  const loadConsultantWorkLogs = async () => {
    if (!selectedConsultant) return;

    try {
      const logs = await getConsultantWorkLogs(selectedConsultant);
      setAllConsultantWorkLogs(logs); // Store all logs
      setConsultantWorkLogs(logs);

      // Filter events for current month
      filterAndSetConsultantEvents(logs, currentViewDate);
    } catch (error) {
      console.error('Error loading consultant work logs:', error);
      toast.error('Failed to load consultant work logs');
    }
  };

  // Add new function to filter and set events
  const filterAndSetConsultantEvents = (logs: ConsultantWorkLog[], date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const calendarEvents = logs
      .map((log: any) => {
        const workDate = new Date(log.work_date);
        if (isNaN(workDate.getTime())) return null;

        // Only include logs for the current view month
        if (workDate < monthStart || workDate > monthEnd) return null;

        return {
          id: log.id,
          title: `${log.hours_worked} hrs`,
          start: workDate,
          end: workDate,
          task: log.task_id,
          hours: log.hours_worked?.toString(),
          desc: log.notes || '',
          projectId: log.project_id,
          status: log.status.toLowerCase(),
          taskName: log.tasks?.title || 'Unknown Task',
          taskDescription: log.tasks?.description || ''
        };
      })
      .filter(Boolean);

    setConsultantEvents(calendarEvents);
  };

  const loadWorkLogs = async () => {
    try {
      const logs = await getWorkLogs();

      // Get start and end of current view month
      const monthStart = startOfMonth(currentViewDate);
      const monthEnd = endOfMonth(currentViewDate);

      const calendarEvents = logs
        .map((log: any) => {
          const workDate = new Date(log.work_date);
          if (isNaN(workDate.getTime())) {
            console.error('Invalid date:', log.work_date);
            return null;
          }

          // Only include logs for the current view month
          if (workDate < monthStart || workDate > monthEnd) {
            return null;
          }

          const task = assignedTasks.find(t => t.id === log.task_id);

          return {
            id: log.id,
            title: task?.taskTitle || 'Unknown Task',
            start: workDate,
            end: workDate,
            task: log.task_id,
            hours: log.hours_worked?.toString(),
            desc: log.notes || '',
            projectId: log.project_id,
            status: log.status || 'pending'
          };
        })
        .filter(Boolean);

      setPersonalEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading work logs:', error);
      toast.error('Failed to load work logs');
    }
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const isWeekend = start.getDay() === 0 || start.getDay() === 6;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isFutureDate = start > today;
    const isCurrentViewMonth = start.getMonth() === currentViewDate.getMonth() &&
                             start.getFullYear() === currentViewDate.getFullYear();

    if (!isWeekend && !isFutureDate && isCurrentViewMonth) {
      setSelectedDate(start);
      setSelectedTaskId("");
      setHours("");
      setDescription("");
      setEditingId(null);
    } else if (isFutureDate) {
      toast.error("Cannot add entries for future dates");
    } else if (!isCurrentViewMonth) {
      toast.error("Can only add entries for the currently viewed month");
    }
  };

  const handleSelectEvent = (event: TimesheetEvent) => {
    if (event.status === 'approved') {
      // Show details in a toast or modal for approved entries
      toast.info(
        <div className="space-y-2">
          <div className="font-semibold">{event.title}</div>
          <div className="text-sm">Date: {format(event.start, "PPPP")}</div>
          <div className="text-sm">Hours: {event.hours}</div>
          {event.desc && <div className="text-sm">Comments: {event.desc}</div>}
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Approved
          </Badge>
        </div>,
        {
          autoClose: 5000,
          closeButton: true
        }
      );
      return;
    }

    // Allow editing only for pending or rejected entries
    setSelectedDate(event.start);
    setSelectedTaskId(event.task);
    setHours(event.hours);
    setDescription(event.desc);
    setEditingId(event.id);
  };

  const handleSaveEntry = async () => {
    if (!selectedDate || !selectedTaskId || !hours.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const hourNum = parseFloat(hours);
    if (isNaN(hourNum) || hourNum <= 0 || hourNum > 24) {
      toast.error("Please enter a valid number of hours (1-24)");
      return;
    }

    try {
      // Find the selected task to get its project_id
      const selectedTask = assignedTasks.find(task => task.id === selectedTaskId);
      if (!selectedTask) {
        toast.error("Selected task not found");
        return;
      }

      // Set the time to noon in local timezone to avoid date shifting
      const dateWithTime = new Date(selectedDate);
      dateWithTime.setHours(12, 0, 0, 0);

      const workLog: WorkLog = {
        project_id: selectedTask.projectId,
        task_id: selectedTaskId,
        hours_worked: hourNum,
        work_date: dateWithTime.toISOString(),
        notes: description || undefined
      };

      if (editingId) {
        // Update existing work log
        await updateWorkLogStatus(editingId, workLog);
        toast.success("Timesheet entry updated successfully");
      } else {
        // Add new work log
        await addWorkLog(workLog);
        toast.success("Timesheet entry added successfully");
      }

      // Reset form before reloading data
      setSelectedDate(null);
      setSelectedTaskId("");
      setHours("");
      setDescription("");
      setEditingId(null);
      setFormData({
        taskId: '',
        hours: 0,
        description: ''
      });

      // Reload the work logs to update the calendar
      await loadWorkLogs();

    } catch (error) {
      console.error('Error saving work log:', error);
      toast.error(editingId ? "Failed to update timesheet entry" : "Failed to save timesheet entry");
    }
  };

  const handleApproveWorkLog = async (id: string) => {
    try {
      await updateWorkLogStatus(id, { status: 'approved' });
      toast.success("Work log approved successfully");
      setShowDetailsDialog(false);
      // Reload the consultant's work logs
      await loadConsultantWorkLogs();
    } catch (error) {
      console.error('Error approving work log:', error);
      toast.error("Failed to approve work log");
    }
  };

  const handleRejectWorkLog = async () => {
    if (!selectedWorkLog || !selectedEventDetails) return;

    try {
      await updateWorkLogStatus(selectedWorkLog.id, {
        status: 'rejected',
        rejectionReason: rejectionComments
      });

      // Send notification using the date from selectedEventDetails
      await createNotification(
        selectedConsultant,
        `Your timesheet entry for ${format(selectedEventDetails.start, "PPPP")} has been rejected(${rejectionComments})`
      );

      toast.success("Work log rejected successfully");
      setShowRejectionDialog(false);
      setRejectionComments("");
      setSelectedWorkLog(null);
      // Reload the consultant's work logs
      await loadConsultantWorkLogs();
    } catch (error) {
      console.error('Error rejecting work log:', error);
      toast.error("Failed to reject work log");
    }
  };

  const openRejectionDialog = (workLog: ConsultantWorkLog, eventDetails: TimesheetEvent) => {
    setSelectedWorkLog(workLog);
    setSelectedEventDetails(eventDetails);
    setRejectionComments("");
    setShowRejectionDialog(true);
  };

  const handleViewChange = (view: View) => {
    setViewMode(view);
  };

  // Get task color class
  const getTaskColor = (taskId: string) => {
    const task = assignedTasks.find(t => t.id === taskId);
    return task?.project
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Custom toolbar component
  const CustomToolbar = ({ onNavigate, date }: any) => {
    return (
      <div className="flex justify-between items-center mb-4 p-2 rounded-md shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold ml-2">
            {format(date, 'MMMM yyyy')}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </Button>
      </div>
    );
  };

  // Custom event component for manager view
  const ManagerEventComponent = ({ event }: { event: TimesheetEvent }) => {
    return (
      <div className="p-2 bg-white rounded-md shadow-sm border">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">{event.taskName}</span>
          <span className="text-sm text-gray-600">{event.hours} hrs</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {event.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleApproveWorkLog(event.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => openRejectionDialog(event as ConsultantWorkLog, event)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          {event.status === 'approved' && (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Approved
            </Badge>
          )}
          {event.status === 'rejected' && (
            <Badge variant="outline" className="bg-red-50 text-red-700">
              <XCircle className="h-3 w-3 mr-1" />
              Rejected
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // Custom event component
  const EventComponent = ({ event }: { event: TimesheetEvent }) => {
    const task = assignedTasks.find(t => t.id === event.task);

    // For managers, show simplified view
    if (isManager) {
      return (
        <div
          className="px-2 py-1 text-sm cursor-pointer"
          onClick={() => handleEventClick(event)}
        >
          <div className="flex items-center gap-2">
            <span>{event.hours} hrs</span>
            {getStatusIcon(event.status)}
          </div>
        </div>
      );
    }

    // For non-managers, show full view
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "px-2 py-1 rounded-sm border text-sm max-w-full overflow-hidden whitespace-nowrap text-ellipsis transition-all",
                getTaskColor(event.task),
                event.status === 'approved' ? 'cursor-default' : 'cursor-pointer'
              )}
            >
              <div className="font-medium flex items-center justify-between gap-1">
                <span>{task?.taskTitle || 'Unknown Task'}</span>
                {getStatusIcon(event.status)}
              </div>
              <div className="text-xs flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.hours} hrs
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    event.status === 'approved' && "bg-green-50 text-green-700",
                    event.status === 'rejected' && "bg-red-50 text-red-700",
                    event.status === 'pending' && "bg-yellow-50 text-yellow-700"
                  )}
                >
                  {getStatusIcon(event.status)}
                  <span className="ml-1">{event.status}</span>
                </Badge>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-4 max-w-xs bg-white border border-indigo-100 shadow-lg">
            <div>
              <div className="font-bold mb-1 flex items-center justify-between">
                {task?.taskTitle || 'Unknown Task'}
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                  {task?.project || 'Unknown Project'}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {format(event.start, "PPPP")} · {event.hours} hours
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    event.status === 'approved' && "bg-green-50 text-green-700",
                    event.status === 'rejected' && "bg-red-50 text-red-700",
                    event.status === 'pending' && "bg-yellow-50 text-yellow-700"
                  )}
                >
                  {getStatusIcon(event.status)}
                  <span className="ml-1">{event.status}</span>
                </Badge>
              </div>
              {event.desc && (
                <div className="text-sm mt-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                  <p className="text-sm">{event.desc}</p>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Custom day cell component
  const DayCell = ({ date }: { date: Date }) => {
    const hasEntries = personalEvents.some(event => {
      if (!event.start || !(date instanceof Date)) return false;
      return format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isFutureDate = date > today;
    const isCurrentViewMonth = date.getMonth() === currentViewDate.getMonth() &&
                             date.getFullYear() === currentViewDate.getFullYear();

    // Disable cell if it's a weekend, future date, or not in current view month
    if (isWeekend || isFutureDate || !isCurrentViewMonth) {
      return (
        <div className="h-full w-full flex items-center justify-center opacity-50 bg-gray-50">
          <span className="text-gray-400">{date instanceof Date ? format(date, 'd') : ''}</span>
        </div>
      );
    }

    return (
      <div className="relative h-full w-full p-1 group">
        <span>{date instanceof Date ? format(date, 'd') : ''}</span>
        {!hasEntries && (
          <CirclePlus
            className="h-4 w-4 text-blue-600 absolute left-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSlot({ start: date });
            }}
          />
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

  const onNavigate = (newDate: Date) => {
    setCurrentViewDate(newDate);
    if (isManager && selectedConsultant) {
      filterAndSetConsultantEvents(allConsultantWorkLogs, newDate);
    }
  };

  // Get status badge for team work logs
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Approved</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  // Update the handleEventClick function
  const handleEventClick = (event: TimesheetEvent) => {
    if (!isManager) return;
    setSelectedEventDetails(event);
    setShowDetailsDialog(true);
  };

  return (
    <Card className=" pt-14 w-full shadow-lg animate-fade-in overflow-hidden border-gray-700">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900">
              Timesheet Calendar
              {isLoading && (
                <span className="ml-2 inline-block animate-spin text-indigo-600">
                  <Clock className="h-4 w-4" />
                </span>
              )}
            </CardTitle>
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
        {isManager ? (
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>My Timesheet</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Manage Team Timesheets</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-0">
              <div className="bg-white rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-md border-indigo-100">
                <Calendar
                  localizer={localizer}
                  events={personalEvents}
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
                  firstDayOfWeek={1}
                  onNavigate={onNavigate}
                  date={currentViewDate}
                />
              </div>
            </TabsContent>

            <TabsContent value="team" className="mt-0">
              <Card className="border-indigo-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-indigo-900">
                    Team Timesheet Management
                  </CardTitle>
                  <CardDescription>
                    Review and approve timesheet entries from your team members
                  </CardDescription>

                  <div className="mt-4">
                    <Label htmlFor="consultant-filter" className="mb-2 block">Select Consultant</Label>
                    <Select
                      value={selectedConsultant}
                      onValueChange={setSelectedConsultant}
                    >
                      <SelectTrigger id="consultant-filter" className="w-full md:w-72">
                        <SelectValue placeholder="Select a consultant" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentData?.employee_details.map((employee) => (
                          <SelectItem key={employee.user_id} value={employee.user_id}>
                            {`${employee.first_name} ${employee.last_name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <CardContent>
                  {selectedConsultant ? (
                    <div className="bg-white rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-md border-indigo-100">
                      <Calendar
                        localizer={localizer}
                        events={consultantEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        defaultView="month"
                        views={['month']}
                        selectable={false}
                        components={{
                          toolbar: CustomToolbar,
                          event: EventComponent
                        }}
                        className="timesheet-calendar"
                        firstDayOfWeek={1}
                        onNavigate={onNavigate}
                        date={currentViewDate}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Please select a consultant to view their timesheet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-md border-indigo-100">
            <Calendar
              localizer={localizer}
              events={personalEvents}
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
              firstDayOfWeek={1}
              onNavigate={onNavigate}
              date={currentViewDate}
            />
          </div>
        )}

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
                <Label htmlFor="task">Task</Label>
                <Select
                  value={selectedTaskId}
                  onValueChange={setSelectedTaskId}
                  disabled={editingId && personalEvents.find(e => e.id === editingId)?.status === 'approved'}
                >
                  <SelectTrigger id="task">
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{task.taskTitle.substring(0, 25) + (task.taskTitle.length > 25 ? "..." : "")}</span>
                          {/* <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                            {task.project}
                          </Badge> */}
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
                  disabled={editingId && personalEvents.find(e => e.id === editingId)?.status === 'approved'}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Comments</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you worked on..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={editingId && personalEvents.find(e => e.id === editingId)?.status === 'approved'}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDate(null)}>
                Close
              </Button>

              {(!editingId || personalEvents.find(e => e.id === editingId)?.status !== 'approved') && (
                <Button onClick={handleSaveEntry} className="ml-2 bg-indigo-600 hover:bg-indigo-700">
                  {editingId ? "Update Entry" : "Save Entry"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Timesheet Entry</DialogTitle>
              <DialogDescription>
                Please provide comments for rejecting this timesheet entry.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="rejection-comments">Comments</Label>
                <Textarea
                  id="rejection-comments"
                  placeholder="Enter rejection comments..."
                  value={rejectionComments}
                  onChange={(e) => setRejectionComments(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRejectWorkLog}
                className="bg-red-600 hover:bg-red-700"
                disabled={!rejectionComments.trim()}
              >
                Reject Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Timesheet Entry Details</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                {selectedEventDetails?.start ? format(selectedEventDetails.start, "PPPP") : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Task</Label>
                <div className="p-2 border rounded-md bg-muted">
                  <div className="font-medium">{selectedEventDetails?.taskName}</div>
                  {selectedEventDetails?.taskDescription && (
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedEventDetails.taskDescription}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Work Date</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {selectedEventDetails?.start ? format(selectedEventDetails.start, "PPPP") : ""}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Hours Worked</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {selectedEventDetails?.hours} hrs
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Notes</Label>
                <div className="p-2 border rounded-md bg-muted whitespace-pre-wrap">
                  {selectedEventDetails?.desc || 'No notes provided'}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-fit",
                      selectedEventDetails?.status === 'approved' && "bg-green-50 text-green-700",
                      selectedEventDetails?.status === 'rejected' && "bg-red-50 text-red-700",
                      selectedEventDetails?.status === 'pending' && "bg-yellow-50 text-yellow-700"
                    )}
                  >
                    {getStatusIcon(selectedEventDetails?.status || 'pending')}
                    <span className="ml-1 capitalize">{selectedEventDetails?.status}</span>
                  </Badge>
                  {selectedEventDetails?.status === 'rejected' && (
                    <div className="text-sm text-red-600">
                      {consultantWorkLogs.find(log => log.id === selectedEventDetails?.id)?.rejection_reason}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
              {isManager && selectedEventDetails?.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => {
                      handleApproveWorkLog(selectedEventDetails.id);
                      setShowDetailsDialog(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      openRejectionDialog(
                        consultantWorkLogs.find(log => log.id === selectedEventDetails?.id) as ConsultantWorkLog,
                        selectedEventDetails as TimesheetEvent
                      );
                      setShowDetailsDialog(false);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}