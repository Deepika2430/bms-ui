import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface WorkLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workLog: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing?: boolean;
}

export function WorkLogDetailsDialog({
  open,
  onOpenChange,
  workLog,
  onApprove,
  onReject,
  isProcessing = false
}: WorkLogDetailsDialogProps) {
  if (!workLog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Timesheet Entry Details</DialogTitle>
          <DialogDescription>
            {format(new Date(workLog.start), "PPPP")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Task</Label>
            <div className="p-2 border rounded-md bg-muted">
              <div className="font-medium">{workLog.taskName}</div>
              {workLog.taskDescription && (
                <div className="text-sm text-gray-600 mt-1">
                  {workLog.taskDescription}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Hours Worked</Label>
            <div className="p-2 border rounded-md bg-muted flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {workLog.hours} hours
            </div>
          </div>

          {workLog.desc && (
            <div className="grid gap-2">
              <Label>Notes</Label>
              <div className="p-2 border rounded-md bg-muted">
                {workLog.desc}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Status</Label>
            <Badge
              variant="outline"
              className={cn(
                "w-fit capitalize",
                workLog.status === 'approved' && "bg-green-50 text-green-700",
                workLog.status === 'rejected' && "bg-red-50 text-red-700",
                workLog.status === 'pending' && "bg-yellow-50 text-yellow-700"
              )}
            >
              {workLog.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
              {workLog.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
              {workLog.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
              {workLog.status}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          {workLog.status === 'pending' && (
            <>
              <Button
                variant="outline"
                className="text-green-600 hover:text-green-700"
                onClick={() => onApprove(workLog.id)}
                disabled={isProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => onReject(workLog.id)}
                disabled={isProcessing}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}