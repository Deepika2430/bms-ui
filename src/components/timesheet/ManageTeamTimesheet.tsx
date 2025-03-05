import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TimesheetView from './TimesheetView';
import { getDepartmentUsers } from '@/services/departmentService';
import { getAssignedTasks } from '@/services/taskService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { getConsultantWorkLogs, approveWorkLog, rejectWorkLog } from '@/services/workLogsService';
import { CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormControl, FormLabel } from '../ui/form';

export default function ManageTeamTimesheet() {
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [userWorkLogs, setUserWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedLogForRejection, setSelectedLogForRejection] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApprovalOptions, setShowApprovalOptions] = useState(false);
  const [approvalType, setApprovalType] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [departmentData, tasksData] = await Promise.all([
          getDepartmentUsers(),
          getAssignedTasks()
        ]);
        if (departmentData && departmentData?.employeeDetails) {
          setDepartmentUsers(departmentData?.employeeDetails);
        }
        setAssignedTasks(tasksData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchUserWorkLogs = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const logs = await getConsultantWorkLogs(selectedUser);
      setUserWorkLogs(logs);
    } catch (error) {
      console.error('Error fetching user work logs:', error);
      toast.error('Failed to load timesheet entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWorkLogs();
  }, [selectedUser]);

  const getDateRangeText = () => {
    switch (approvalType) {
      case 'all':
        return 'All Pending Entries';
      case 'week':
        return 'Current Week';
      case 'month':
        return 'Current Month';
      case 'range':
        if (dateRange?.from && dateRange?.to) {
          return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
        }
        return 'Select date range';
      default:
        return 'Select a range';
    }
  };

  const handleApproveAll = async (type?: string, date?: Date) => {
    try {
      setIsProcessing(true);
      let logsToApprove = [];

      if (type) {
        let startDate, endDate;

        switch (type) {
          case 'week':
            startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
            endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
            break;
          case 'month':
            startDate = startOfMonth(new Date());
            endDate = endOfMonth(new Date());
            break;
          case 'range':
            if (dateRange?.from && dateRange?.to) {
              startDate = dateRange.from;
              endDate = dateRange.to;
            }
            break;
          default:
            break;
        }

        if (startDate && endDate) {
          logsToApprove = userWorkLogs.filter(log => {
            const logDate = new Date(log.work_date);
            return logDate >= startDate &&
                   logDate <= endDate &&
                   log.status.toLowerCase() === 'pending';
          });
        }
      } else {
        logsToApprove = userWorkLogs.filter(log => log.status.toLowerCase() === 'pending');
      }

      if (logsToApprove.length === 0) {
        toast.info('No pending entries to approve');
        return;
      }

      await Promise.all(logsToApprove.map(log => approveWorkLog(log.id)));
      toast.success(`${type ? `All ${type}` : 'All'} pending entries approved successfully`);
      fetchUserWorkLogs();
    } catch (error) {
      console.error('Error approving entries:', error);
      toast.error('Failed to approve entries');
    } finally {
      setIsProcessing(false);
      setShowApprovalOptions(false);
    }
  };

  const handleRejectAll = () => {
    setSelectedLogForRejection('all');
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    try {
      setIsProcessing(true);
      if (!rejectionReason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }

      let logsToReject = [];

      switch (approvalType) {
        case 'all':
          logsToReject = userWorkLogs.filter(log => log.status.toLowerCase() === 'pending');
          break;
        case 'week':
          const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
          const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
          logsToReject = userWorkLogs.filter(log => {
            const logDate = new Date(log.work_date);
            return logDate >= weekStart &&
                   logDate <= weekEnd &&
                   log.status.toLowerCase() === 'pending';
          });
          break;
        case 'month':
          const monthStart = startOfMonth(new Date());
          const monthEnd = endOfMonth(new Date());
          logsToReject = userWorkLogs.filter(log => {
            const logDate = new Date(log.work_date);
            return logDate >= monthStart &&
                   logDate <= monthEnd &&
                   log.status.toLowerCase() === 'pending';
          });
          break;
        case 'range':
          if (dateRange?.from && dateRange?.to) {
            logsToReject = userWorkLogs.filter(log => {
              const logDate = new Date(log.work_date);
              return logDate >= dateRange.from &&
                     logDate <= dateRange.to &&
                     log.status.toLowerCase() === 'pending';
            });
          }
          break;
      }

      if (logsToReject.length === 0) {
        toast.info('No pending entries to reject');
        return;
      }

      await Promise.all(logsToReject.map(log =>
        rejectWorkLog(log.id, rejectionReason)
      ));

      toast.success(`Selected entries rejected successfully`);
      setShowRejectDialog(false);
      setRejectionReason("");
      setDateRange(undefined);
      fetchUserWorkLogs();
    } catch (error) {
      console.error('Error rejecting entries:', error);
      toast.error('Failed to reject entries');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSingleLogAction = async (logId: string, action: 'approve' | 'reject', approvalType?: string, date?: Date) => {
    if (action === 'approve') {
      try {
        setIsProcessing(true);
        if (approvalType && date) {
          let logsToApprove = [];
          const startDate = approvalType === 'week'
            ? startOfWeek(date, { weekStartsOn: 1 })
            : startOfMonth(date);
          const endDate = approvalType === 'week'
            ? endOfWeek(date, { weekStartsOn: 1 })
            : endOfMonth(date);

          logsToApprove = userWorkLogs.filter(log => {
            const logDate = new Date(log.work_date);
            return logDate >= startDate && logDate <= endDate && log.status.toLowerCase() === 'pending';
          });

          await Promise.all(logsToApprove.map(log => approveWorkLog(log.id)));
          toast.success(`All ${approvalType} entries approved successfully`);
        } else {
          await approveWorkLog(logId);
          toast.success('Entry approved successfully');
        }
        fetchUserWorkLogs();
      } catch (error) {
        console.error('Error approving entry:', error);
        toast.error('Failed to approve entry');
      } finally {
        setIsProcessing(false);
      }
    } else {
      setSelectedLogForRejection(logId);
      setShowRejectDialog(true);
    }
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Pick a date range";
    if (!range.to) return `From ${format(range.from, "LLL dd, y")}`;
    return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`;
  };

  if (loading && !selectedUser) {
    return <div className="p-4">Loading team timesheet data...</div>;
  }

  return (
    <Card className="overflow-hidden mb-0 pb-0">
      <CardContent className="overflow-hidden pb-0">
        <div className="flex items-center gap-4 mb-0 pt-16 pb-2">
          <Label>Select Consultant: </Label>
          <div className="flex-1">
            <Select
              value={selectedUser}
              onValueChange={setSelectedUser}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Select Team Member"
                  className="text-muted-foreground"
                />
              </SelectTrigger>
              <SelectContent>
                {departmentUsers?.map((user) => (
                  <SelectItem
                    key={user.userId}
                    value={user.userId}
                    className="cursor-pointer"
                  >
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUser && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-green-600 hover:text-green-700"
                onClick={() => setShowApprovalOptions(true)}
                disabled={isProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={handleRejectAll}
                disabled={isProcessing}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>

        {selectedUser && (
          <TimesheetView
            userId={selectedUser}
            readOnly={true}
            onApprove={(logId) => handleSingleLogAction(logId, 'approve')}
            onReject={(logId) => handleSingleLogAction(logId, 'reject')}
            assignedTasks={assignedTasks}
            initialWorkLogs={userWorkLogs}
            style={{ height: '500px' }}
            isProcessing={isProcessing}
          />
        )}

        <Dialog open={showRejectDialog} onOpenChange={(open) => {
          setShowRejectDialog(open);
          if (!open) {
            setDateRange(undefined);
            setStartDate('');
            setEndDate('');
            setRejectionReason('');
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Timesheet Entries</DialogTitle>
              <DialogDescription>
                Select the range of entries to reject
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <RadioGroup
                value={approvalType}
                onValueChange={(value) => {
                  setApprovalType(value);
                  if (value !== 'range') {
                    setDateRange(undefined);
                  }
                }}
                className="grid gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="reject-all" />
                  <Label htmlFor="reject-all">All Pending Entries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="week" id="reject-week" />
                  <Label htmlFor="reject-week">Current Week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="month" id="reject-month" />
                  <Label htmlFor="reject-month">Current Month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="range" id="reject-range" />
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="reject-range">Custom Date Range</Label>
                    {approvalType === 'range' && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              if (e.target.value) {
                                setDateRange(prev => ({
                                  ...prev,
                                  from: new Date(e.target.value)
                                }));
                              }
                            }}
                            className="w-40 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                          <span>To</span>
                          <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(e) => {
                              setEndDate(e.target.value);
                              if (e.target.value) {
                                setDateRange(prev => ({
                                  ...prev,
                                  to: new Date(e.target.value)
                                }));
                              }
                            }}
                            className="w-40 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>

              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="min-h-[100px]"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
                setDateRange(undefined);
                setStartDate('');
                setEndDate('');
              }}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={isProcessing || !rejectionReason.trim() || (approvalType === 'range' && (!dateRange?.from || !dateRange?.to))}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject Selected
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showApprovalOptions} onOpenChange={(open) => {
          setShowApprovalOptions(open);
          if (!open) {
            setDateRange(undefined);
            setStartDate('');
            setEndDate('');
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Approve Timesheet Entries</DialogTitle>
              <DialogDescription>
                Select the range of entries to approve
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <RadioGroup
                value={approvalType}
                onValueChange={(value) => {
                  setApprovalType(value);
                  if (value !== 'range') {
                    setDateRange(undefined);
                    setStartDate('');
                    setEndDate('');
                  }
                }}
                className="grid gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All Pending Entries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="week" id="week" />
                  <Label htmlFor="week">Current Week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="month" id="month" />
                  <Label htmlFor="month">Current Month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="range" id="range" />
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="range">Custom Date Range</Label>
                    {approvalType === 'range' && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              if (e.target.value) {
                                setDateRange(prev => ({
                                  ...prev,
                                  from: new Date(e.target.value)
                                }));
                              }
                            }}
                            className="w-40 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                          <span>To</span>
                          <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(e) => {
                              setEndDate(e.target.value);
                              if (e.target.value) {
                                setDateRange(prev => ({
                                  ...prev,
                                  to: new Date(e.target.value)
                                }));
                              }
                            }}
                            className="w-40 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowApprovalOptions(false);
                setDateRange(undefined);
                setStartDate('');
                setEndDate('');
              }}>
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApproveAll(approvalType)}
                disabled={isProcessing || (approvalType === 'range' && (!dateRange?.from || !dateRange?.to))}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve Selected
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}