import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomToolbarProps {
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  date: Date;
}

export function CustomToolbar({ onNavigate, date }: CustomToolbarProps) {
  return (
    <div className="flex justify-between items-center mb-0 p-2 rounded-md shadow-sm">
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
}