
import React from "react";

const DashboardCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div
      className={`rounded-2xl shadow-md p-5 sm:p-6 flex items-center justify-between transition-transform transform hover:scale-105 duration-300 ${color} text-white`}
    >
      <div>
        <h3 className="text-sm sm:text-base font-medium">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
      </div>

      <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/30">
        {Icon && <Icon className="w-6 h-6 sm:w-8 sm:h-8" />}
      </div>
    </div>
  );
};

export default DashboardCard;
