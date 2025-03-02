import { ReactNode } from "react";

interface ParkingCardProps {
  title: string;
  value: number;
  color: string;
  icon: ReactNode;
}

export default function ParkingCard({
  title,
  value,
  color,
  icon,
}: ParkingCardProps) {
  return (
    <div
      className={`p-6 bg-gradient-to-r ${color} rounded-2xl shadow-lg flex items-center justify-between`}
    >
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
}
