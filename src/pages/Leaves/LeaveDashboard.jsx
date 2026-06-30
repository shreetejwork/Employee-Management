import { useMemo } from "react";
import { useLeaveContext } from "../../context/LeaveContext";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import RecentLeaves from "./RecentLeaves";

const LeaveDashboard = () => {
  const { leaves } = useLeaveContext();

  const stats = useMemo(
    () => ({
      total: leaves.length,
      pending: leaves.filter((l) => l.status === "Pending").length,
      approved: leaves.filter((l) => l.status === "Approved").length,
      rejected: leaves.filter((l) => l.status === "Rejected").length,
    }),
    [leaves],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leaves"
          value={stats.total}
          icon={<IoCalendarOutline size={22} />}
          color="primary"
        />
      </div>

      <Card title="Recent Leaves" noPadding>
        <RecentLeaves />
      </Card>
    </div>
  );
};

export default LeaveDashboard;
