import React from 'react';
import { Settings, Globe, Shield, Bell, Database, Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure global platform parameters and security defaults.</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <SettingsSection 
          icon={<Globe className="w-5 h-5" />} 
          title="General Configuration"
          description="Basic platform info and localization."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Platform Name</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant" defaultValue="Sayansi Yathu" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Academic Year</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant" defaultValue="2024" />
            </div>
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection 
          icon={<Shield className="w-5 h-5" />} 
          title="Security & Access"
          description="Manage security policies and password requirements."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Multi-Factor Authentication</p>
                <p className="text-sm text-gray-500">Require MFA for all administrative accounts.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary-vibrant" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Public Registrations</p>
                <p className="text-sm text-gray-500">Allow users to create accounts without invite.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary-vibrant" />
            </div>
          </div>
        </SettingsSection>

        {/* API & Backend */}
        <SettingsSection 
          icon={<Database className="w-5 h-5" />} 
          title="Backend Endpoints"
          description="Microservice target URLs."
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Python AI Endpoint</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant font-mono text-xs" defaultValue="http://localhost:5000" />
            </div>
          </div>
        </SettingsSection>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-vibrant text-white rounded-lg hover:bg-primary-vibrant/90 transition-all font-medium shadow-md shadow-primary-vibrant/20">
            <Save className="w-5 h-5" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ icon, title, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-start gap-4">
        <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
