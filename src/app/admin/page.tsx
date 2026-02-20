'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { formatDistanceToNow } from 'date-fns';

type Report = {
  id: number;
  description: string;
  status: string;
  createdAt: string;
  animalType: string;
};

// Removed ContactRequest type as it was unused

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  // Removed unused contacts state
  const { addToast } = useToast();

  const handleLogin = async () => {
    // Simple mock auth for this task
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      addToast({ type: 'error', title: 'Invalid Password' });
    }
  };

  const fetchData = async () => {
    try {
      const reportsRes = await fetch('/api/reports');
      const reportsData = await reportsRes.json();
      setReports(reportsData);

      // In a real app, separate endpoint for contact requests
      // For now, we'll mock or assume we fetched them if the API existed
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReports(reports.map(r => r.id === id ? { ...r, status } : r));
        addToast({ type: 'success', title: 'Status Updated' });
      }
    } catch (e) {
      console.error(e);
      addToast({ type: 'error', title: 'Update Failed' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <Input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleLogin}>Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Reports</h2>
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">#{report.id} - {report.animalType}</p>
                <p className="text-sm text-muted-foreground truncate max-w-xs">{report.description}</p>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(report.createdAt))} ago</p>
              </div>
              <select
                value={report.status}
                onChange={(e) => updateStatus(report.id, e.target.value)}
                className="border rounded p-2 text-sm"
              >
                <option value="REPORTED">REPORTED</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="RESCUED">RESCUED</option>
              </select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
