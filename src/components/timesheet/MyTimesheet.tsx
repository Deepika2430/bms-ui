import { useEffect, useState } from 'react';
import TimesheetView from './TimesheetView';
import { getUserDetails } from '@/services/userService';

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user: User = await getUserDetails();
        if (user && user.id) {
          setUserId(user.id);
        } else {
          setError('User details not found');
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setError('Failed to load timesheet');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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
      <TimesheetView userId={userId} />
    </div>
  );
}