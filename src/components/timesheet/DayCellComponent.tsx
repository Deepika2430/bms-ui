import { format } from "date-fns";
import { CirclePlus } from "lucide-react";

interface DayCellProps {
  date: Date;
  workLogs: any[];
  onAddEntry: (args: { start: Date }) => void;
  readOnly?: boolean;
  currentViewDate: Date;
}

export function DayCellComponent({
  date,
  workLogs,
  onAddEntry,
  readOnly,
  currentViewDate
}: DayCellProps) {
  const hasEntries = workLogs.some(event => {
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
      {!hasEntries && !readOnly && (
        <CirclePlus
          className="h-4 w-4 text-blue-600 absolute left-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onAddEntry({ start: date });
          }}
        />
      )}
    </div>
  );
}