
import { cn } from "@/lib/utils";
import { Project, Client, User } from "@/lib/types";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import { Calendar, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectCardProps {
  project: Project;
  client: Client;
  manager: User;
  onClick?: () => void;
  className?: string;
}

const ProjectCard = ({ project, client, manager, onClick, className }: ProjectCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 card-hover cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-base truncate">{project.name}</h3>
        <StatusBadge status={project.status} />
      </div>
      
      <div className="text-sm text-muted-foreground mb-2">
        Client: {client.name}
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
      
      <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
        <Calendar className="h-3.5 w-3.5" />
        <span>
          {format(new Date(project.startDate), "MMM d, yyyy")} 
          {project.endDate && ` - ${format(new Date(project.endDate), "MMM d, yyyy")}`}
        </span>
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground gap-1 mb-3">
        <Users className="h-3.5 w-3.5" />
        <span>{project.teamMemberIds.length} team members</span>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={manager.avatar} alt={manager.name} />
            <AvatarFallback>{manager.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs">Manager: {manager.name}</span>
        </div>
        
        {project.budget && (
          <span className="text-xs font-medium">
            Budget: ${project.budget.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
