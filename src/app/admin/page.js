import StatCard from "@/components/MetricCard";
import RegistrationTable from "@/components/RegistrationTable";
import ChartCard from "@/components/EarningSummaryChart";
import { Area, ResponsiveContainer } from "recharts";
import AlcoholConsumptionTrendChart from "@/components/AlcoholConsumptionTrendChart";
import EarningSummaryChart from "@/components/EarningSummaryChart";
import MetricCard from "@/components/MetricCard";

const Admin = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Total User Card */}
          <MetricCard
            title="Total User"
            value={2500}
            percentageChange={4}
            percentageDirection="up"
            timePeriodData={months}
          />

          {/* Total Service Provider Card */}
          <MetricCard
            title="Total Service provider"
            value={200}
            percentageChange={4}
            percentageDirection="up" // Assuming it's also up, change to 'down' if needed
            timePeriodData={months}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Earning Summary Chart */}
          <div className="min-h-[340px]">
      
            {/* Ensure minimum height for chart visibility */}
            <EarningSummaryChart />
          </div>

          {/* Alcohol Consumption Trend Line Chart */}
          <div className="min-h-[340px]">
           
            {/* Ensure minimum height for chart visibility */}
            <AlcoholConsumptionTrendChart />
          </div>
        </div>

        <div className="p-4">
          <RegistrationTable />
        </div>
      </div>
    </>
  );
};
export default Admin;
