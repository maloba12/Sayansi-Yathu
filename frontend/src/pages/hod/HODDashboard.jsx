import React from 'react';
import { Users, Activity, ClipboardList, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, change, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
    <div className="flex items-end justify-between mt-2">
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? '↑' : '↓'} {change}
      </span>
    </div>
  </div>
);

export default function HODDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Departmental Supervision</h1>
        <p className="text-gray-500 mt-2">Monitoring academic performance and curriculum delivery across the Science Department.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Teacher Activity" value="92%" change="4%" trend="up" />
        <StatCard title="Lab Engagement" value="785" change="12%" trend="up" />
        <StatCard title="Avg. Pass Rate" value="68.4%" change="1.2%" trend="down" />
        <StatCard title="Assessments" value="24" change="0" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teacher Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-vibrant" />
              Teacher Performance Tracking
            </h3>
            <button className="text-sm text-primary-vibrant font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3">
                  <th className="py-3">Name</th>
                  <th className="py-3">Labs Assigned</th>
                  <th className="py-3">Avg. Score</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="py-4 text-sm font-medium text-gray-900">Mr. Kelvin Chanda</td>
                  <td className="py-4 text-sm text-gray-600">12</td>
                  <td className="py-4 text-sm text-gray-600">74%</td>
                  <td className="py-4"><span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span></td>
                </tr>
                <tr>
                  <td className="py-4 text-sm font-medium text-gray-900">Mrs. Mutale Banda</td>
                  <td className="py-4 text-sm text-gray-600">8</td>
                  <td className="py-4 text-sm text-gray-600">62%</td>
                  <td className="py-4"><span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Curriculum Coverage */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-primary-vibrant" />
              Curriculum Coverage
            </h3>
          </div>
          {[
            { label: 'Physics Grade 10', progress: 85, color: 'bg-purple-500' },
            { label: 'Chemistry Grade 11', progress: 42, color: 'bg-amber-500' },
            { label: 'Biology Grade 12', progress: 98, color: 'bg-green-500' }
          ].map((item) => (
            <div key={item.label} className="mb-6">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-700">{item.label}</span>
                <span className="text-gray-500">{item.progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${item.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
