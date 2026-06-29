import { useMemo } from 'react';
import { useLeaveContext } from '../../context/LeaveContext';
import { IoCalendarOutline, IoTimeOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import LeaveRequests from './LeaveRequests';

const LeaveDashboard = () => {
  const { leaves } = useLeaveContext();

  const stats = useMemo(() => ({
    total: leaves.length,
    pending: leaves.filter((l) => l.status === 'Pending').length,
    approved: leaves.filter((l) => l.status === 'Approved').length,
    rejected: leaves.filter((l) => l.status === 'Rejected').length,
  }), [leaves]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leaves" value={stats.total} icon={<IoCalendarOutline size={22} />} color="primary" />
        <StatCard title="Pending" value={stats.pending} icon={<IoTimeOutline size={22} />} color="warning" />
        <StatCard title="Approved" value={stats.approved} icon={<IoCheckmarkCircleOutline size={22} />} color="success" />
        <StatCard title="Rejected" value={stats.rejected} icon={<IoCalendarOutline size={22} />} color="danger" />
      </div>

      <Card title="Recent Leave Requests" noPadding>
        <LeaveRequests />
      </Card>
    </div>
  );
};

export default LeaveDashboard;
