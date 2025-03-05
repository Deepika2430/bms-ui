import { useEffect, useState } from 'react';
import TimesheetView from './TimesheetView';
import { getUserDetails } from '@/services/userService';
import { getAssignedTasks } from '@/services/taskService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function MyTimesheet() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedTasks, setAssignedTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [user, tasks] = await Promise.all([
          getUserDetails(),
          getAssignedTasks()
        ]);

        if (user && user.id) {
          setUserId(user.id);
          setAssignedTasks(tasks);
        } else {
          setError('User details not found');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load timesheet');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading timesheet...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!userId) {
    return <div className="p-4">Unable to load timesheet</div>;
  }

  return (
    <div className="pt-16">
      <TimesheetView
        userId={userId}
        assignedTasks={assignedTasks}
      />
    </div>
  );
}