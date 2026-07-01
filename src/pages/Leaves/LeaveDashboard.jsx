import { useMemo, useEffect } from "react";
import { useLeaveContext } from "../../context/LeaveContext";
import {
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import RecentLeaves from "./RecentLeaves";
import { DashboardSkeleton } from "../../components/ui/LoadingSkeleton";

const LeaveDashboard = () => {
  const { leaves, loading, error, getLeaves } = useLeaveContext();

  useEffect(() => {
    getLeaves().catch(() => {});
  }, [getLeaves]);

  const stats = useMemo(
    () => ({
      total: leaves.length,
      pending: leaves.filter((l) => l.status === "Pending").length,
      approved: leaves.filter((l) => l.status === "Approved").length,
      rejected: leaves.filter((l) => l.status === "Rejected").length,
    }),
    [leaves],
  );

  if (loading && leaves.length === 0) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger flex items-center justify-between gap-3">
          <span>{error}</span>
          <Button size="sm" variant="outline" onClick={() => getLeaves()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leaves" value={stats.total} icon={<IoCalendarOutline size={22} />} color="primary" />
        <StatCard title="Pending" value={stats.pending} icon={<IoTimeOutline size={22} />} color="warning" />
        <StatCard title="Approved" value={stats.approved} icon={<IoCheckmarkCircleOutline size={22} />} color="success" />
        <StatCard title="Rejected" value={stats.rejected} icon={<IoCloseCircleOutline size={22} />} color="danger" />
      </div>

      <Card title="Recent Leaves" noPadding>
        <RecentLeaves />
      </Card>
    </div>
  );
};

export default LeaveDashboard;
