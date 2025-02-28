import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

const taskSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  taskType: z.string().min(1, "Task type is required"),
  taskTitle: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required")
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: "Start date must be in YYYY-MM-DD format"
    }),
  endDate: z.string().min(1, "End date is required")
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: "End date must be in YYYY-MM-DD format"
    }),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  estimatedHours: z.string().min(1, "Estimated hours is required"),
  assignedTo: z.string().min(1, "Assigned to is required"),
});

interface TaskFormProps {
  projects: { id: string; projectName: string }[];
  consultants: { id: string; name: string }[];
  submitData: (data: z.infer<typeof taskSchema>) => void;
  onCancel: () => void;
  initialData?: z.infer<typeof taskSchema>;
  readOnly?: boolean;
}

const TaskForm = ({ projects, consultants, submitData, onCancel, initialData, readOnly }: TaskFormProps) => {
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      projectId: initialData?.projectId || "",
      taskType: initialData?.taskType || "",
      taskTitle: initialData?.taskTitle || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
      status: initialData?.status || "open",
      priority: initialData?.priority || "",
      estimatedHours: initialData?.estimatedHours || "",
      assignedTo: initialData?.assignedTo || "",
    },
  });

  const selectedProject = form.watch("projectId");

  useEffect(() => {
    console.log("TaskForm component mounted");
  }, []);

  useEffect(() => {
    if (initialData) {
      form.reset({
        projectId: initialData.projectId,
        taskType: initialData.taskType,
        taskTitle: initialData.taskTitle,
        description: initialData.description,
        startDate: new Date(initialData.startDate).toISOString().split('T')[0],
        endDate: new Date(initialData.endDate).toISOString().split('T')[0],
        status: initialData.status,
        priority: initialData.priority,
        estimatedHours: initialData.estimatedHours,
        assignedTo: initialData.assignedTo,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };
      await submitData(formattedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-nav-accent text-white">
        <CardTitle>
          {readOnly ? 'Task Details' : initialData ? 'Edit Task' : 'Create Task'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects?.map((project) => (
                          <SelectItem key={project?.id} value={project?.id}>
                            {project?.projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taskTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!selectedProject || readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!selectedProject || readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date*</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" disabled={!selectedProject || readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date*</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" disabled={!selectedProject || readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedProject || readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="open" value="open">Open</SelectItem>
                        <SelectItem key="in_progress" value="in_progress">In Progress</SelectItem>
                        <SelectItem key="completed" value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedProject || readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Priority..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="low" value="low">Low</SelectItem>
                        <SelectItem key="medium" value="medium">Medium</SelectItem>
                        <SelectItem key="high" value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Hours*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!selectedProject || readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedProject || readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Consultant..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {consultants?.map((consultant) => (
                          <SelectItem key={consultant?.id} value={consultant?.id}>
                            {consultant?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                {readOnly ? 'Close' : 'Cancel'}
              </Button>
              {!readOnly && (
                <Button
                  type="submit"
                  className="bg-nav-accent text-white"
                >
                  {initialData ? "Update Task" : "Create Task"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
