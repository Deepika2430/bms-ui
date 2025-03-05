import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimesheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  editingId: string | null;
  assignedTasks: any[];
  onSave: (formData: any) => void;
  workLogs: any[];
}

export function TimesheetDialog({
  open,
  onOpenChange,
  date,
  editingId,
  assignedTasks,
  onSave,
  workLogs
}: TimesheetDialogProps) {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const currentLog = editingId ? workLogs.find(l => l.id === editingId) : null;
  const isReadOnly = currentLog?.status?.toLowerCase() === 'approved';

  useEffect(() => {
    if (editingId) {
      const log = workLogs.find(l => l.id === editingId);
      if (log) {
        setSelectedTaskId(log.task);
        setHours(log.hours);
        setDescription(log.desc);
      }
    } else {
      setSelectedTaskId("");
      setHours("");
      setDescription("");
    }
  }, [editingId, workLogs]);

  const handleSave = () => {
    if (!date || !selectedTaskId || !hours.trim()) {
      return;
    }

    const selectedTask = assignedTasks.find(task => task.id === selectedTaskId);
    if (!selectedTask) return;

    const dateWithTime = new Date(date);
    dateWithTime.setHours(12, 0, 0, 0);

    onSave({
      project_id: selectedTask.projectId,
      task_id: selectedTaskId,
      hours_worked: parseFloat(hours),
      work_date: dateWithTime.toISOString(),
      notes: description || undefined
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          initialFocusRef.current?.focus();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.querySelector('[tabindex="-1"]')?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isReadOnly ? "View Timesheet Entry" : (editingId ? "Edit Timesheet Entry" : "New Timesheet Entry")}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {date ? format(date, "PPPP") : ""}
          </DialogDescription>
        </DialogHeader>

        {isReadOnly && (
          <Alert className="mb-0 ">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This timesheet entry has been approved and cannot be modified.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task">Task</Label>
            {isReadOnly ? (
              <div className="p-2 border rounded-md bg-muted">
                {assignedTasks.find(t => t.id === selectedTaskId)?.taskTitle || 'Unknown Task'}
              </div>
            ) : (
              <Select
                value={selectedTaskId}
                onValueChange={setSelectedTaskId}
              >
                <SelectTrigger id="task">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  {assignedTasks && assignedTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.taskTitle || task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hours">Hours Worked</Label>
            {isReadOnly ? (
              <div className="p-2 border rounded-md bg-muted">
                {hours} hours
              </div>
            ) : (
              <Input
                id="hours"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Notes</Label>
            {isReadOnly ? (
              <div className="p-2 border rounded-md bg-muted whitespace-pre-wrap">
                {description || 'No notes provided'}
              </div>
            ) : (
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any notes or comments..."
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            ref={initialFocusRef}
          >
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSave}>
              {editingId ? "Update" : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}