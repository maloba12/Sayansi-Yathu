import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AdminLayout({ children }) {
  // If no children provided, render Outlet for nested routes
  return children || <Outlet />;
}
