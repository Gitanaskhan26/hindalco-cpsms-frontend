'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ScanLine, Map, ShieldCheck, Users, UserPlus } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { PermitCard as DashboardPermitCard } from '@/components/dashboard/permit-card';
import { VisitorCard } from '@/components/dashboard/visitor-card';
import { PermitForm } from '@/components/permit-form';
import type { Permit, Visitor } from '@/lib/types';
import { initialPermits } from '@/lib/data';
import { fetchAllVisitors } from '@/lib/visitor-data';
import { useUser } from '@/context/user-context';
import { VisitorRequestForm } from '@/components/visitor-request-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  const { user } = useUser();
  const [isPermitFormOpen, setIsPermitFormOpen] = React.useState(false);
  const [isVisitorRequestFormOpen, setIsVisitorRequestFormOpen] = React.useState(false);
  const [permits, setPermits] = React.useState<Permit[]>(initialPermits);
  const [visitors, setVisitors] = React.useState<Visitor[]>([]);

  React.useEffect(() => {
    const loadVisitors = async () => {
        const activeVisitors = await fetchAllVisitors();
        setVisitors(activeVisitors);
    };
    loadVisitors();
  }, []);

  const stats = React.useMemo(() => {
    const activePermits = permits.filter(
      p => p.status === 'Approved' || p.status === 'Pending'
    ).length;
    const pendingApproval = permits.filter(p => p.status === 'Pending').length;
    const highRiskToday = permits.filter(p => p.riskLevel === 'high').length;
    const activeVisitors = visitors.length;

    return [
      {
        title: 'Active Permits',
        value: activePermits.toString(),
        change: '+12%',
      },
      {
        title: 'Pending Approval',
        value: pendingApproval.toString(),
        change: '-3%',
      },
      {
        title: 'High Risk Today',
        value: highRiskToday.toString(),
        change: '+1%',
      },
      { 
        title: 'Active Visitors', 
        value: activeVisitors.toString(), 
        change: `+${activeVisitors}`,
        icon: Users
      },
    ];
  }, [permits, visitors]);

  const handlePermitCreated = React.useCallback((newPermit: Permit) => {
    setPermits(prev => [newPermit, ...prev]);
    setIsPermitFormOpen(false);
  }, []);

  const handleVisitorRequestSent = React.useCallback(() => {
      // In a real app, you might refresh a list of pending requests here.
      setIsVisitorRequestFormOpen(false);
  }, []);

  const recentPermits = permits.slice(0, 4);
  const highRiskPendingPermits = permits.filter(
    p => p.riskLevel === 'high' && p.status === 'Pending'
  );

  const isSecurity = user?.type === 'employee' && user.department === 'Security';
  const isSafety = user?.type === 'employee' && (user.department === 'Safety' || user.department === 'Fire and Safety');

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            {isSecurity && (
              <Button variant="outline" onClick={() => setIsVisitorRequestFormOpen(true)}>
                <UserPlus className="mr-2" />
                Request Visitor Pass
              </Button>
            )}
            <Button onClick={() => setIsPermitFormOpen(true)}>
              <Plus className="mr-2" />
              New Permit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
            />
          ))}
        </div>

        {isSafety && (
            <Card className="bg-card rounded-xl shadow-sm p-4 md:p-6 mb-8 border border-destructive/50">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl">High-Risk Permits for Review</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                {highRiskPendingPermits.length > 0 ? (
                  highRiskPendingPermits.map(permit => (
                    <DashboardPermitCard
                      key={permit.id}
                      id={permit.id}
                      type="Work Permit"
                      location="Plant Area"
                      risk="High"
                      status={permit.status}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No high-risk permits are pending review.</p>
                )}
                </div>
              </CardContent>
            </Card>
        )}

        <div className="bg-card rounded-xl shadow-sm p-4 md:p-6 mb-8 border">
          <h2 className="text-xl font-bold mb-4">Recent Permits</h2>
          <div className="space-y-4">
            {recentPermits.map(permit => (
              <DashboardPermitCard
                key={permit.id}
                id={permit.id}
                type="Work Permit"
                location="Plant Area"
                risk={
                  permit.riskLevel.charAt(0).toUpperCase() +
                  permit.riskLevel.slice(1) as any
                }
                status={permit.status}
              />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-4 md:p-6 mb-8 border">
          <h2 className="text-xl font-bold mb-4">Active Visitors</h2>
          <div className="space-y-4">
            {visitors.length > 0 ? (
                visitors.map(visitor => (
                    <VisitorCard key={visitor.id} visitor={visitor} />
                ))
            ) : (
                <p className="text-muted-foreground text-sm">No active visitors found.</p>
            )}
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-24 text-base flex-col sm:flex-row"
            asChild
          >
            <Link href="/scan">
              <ScanLine className="mb-2 sm:mb-0 sm:mr-2" />
              Scan QR Code
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-24 text-base flex-col sm:flex-row"
            asChild
          >
            <Link href="/map">
              <Map className="mb-2 sm:mb-0 sm:mr-2" />
              View Plant Map
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-24 text-base flex-col sm:flex-row"
            asChild
          >
            <Link href="/permits">
              <ShieldCheck className="mb-2 sm:mb-0 sm:mr-2" />
              All Permits
            </Link>
          </Button>
        </div>
      </div>
      <PermitForm
        isOpen={isPermitFormOpen}
        onOpenChange={setIsPermitFormOpen}
        onPermitCreated={handlePermitCreated}
      />
      <VisitorRequestForm
        isOpen={isVisitorRequestFormOpen}
        onOpenChange={setIsVisitorRequestFormOpen}
        onVisitorRequestSent={handleVisitorRequestSent}
      />
    </>
  );
}
