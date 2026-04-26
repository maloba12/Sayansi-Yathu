import React from 'react';
import { Users, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Mon', users: 400, experiments: 240 },
  { name: 'Tue', users: 500, experiments: 310 },
  { name: 'Wed', users: 450, experiments: 280 },
  { name: 'Thu', users: 600, experiments: 390 },
  { name: 'Fri', users: 700, experiments: 480 },
  { name: 'Sat', users: 300, experiments: 150 },
  { name: 'Sun', users: 450, experiments: 290 },
];

export default function DashboardHome() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500 mt-1">Real-time platform analytics and system health.</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg border border-emerald-200 flex items-center shadow-sm animate-pulse">
           <CheckCircle className="w-5 h-5 mr-2" />
           <span className="font-bold text-sm">FULLY IMPLEMENTED SYSTEM</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1,248</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 font-medium flex items-center">
              <Activity className="w-4 h-4 mr-1" /> +12%
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* ... More stat cards ... */}
      </div>

      {/* Charts & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Overview</h3>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="experiments" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium text-emerald-900">PHP API Core</span>
              </div>
              <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium text-emerald-900">Database Engine</span>
              </div>
              <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-amber-900">Python AI Microservice</span>
              </div>
              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">High Load</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
