'use client';
import * as React from 'react';
import { Plus, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PermitCard } from '@/components/dashboard/permit-card';
import { PermitForm } from '@/components/permit-form';
import type { Permit } from '@/lib/types';
import { initialPermits } from '@/lib/data';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PermitsPage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [permits, setPermits] = React.useState<Permit[]>(initialPermits);
  const [riskFilter, setRiskFilter] = React.useState('all');

  const handlePermitCreated = React.useCallback((newPermit: Permit) => {
    setPermits(prev => [newPermit, ...prev]);
    setIsFormOpen(false);
  }, []);

  const filteredPermits = permits.filter(permit => {
    if (riskFilter === 'all') return true;
    return permit.riskLevel === riskFilter;
  });

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">All Permits</h1>
          <div className="flex gap-2">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <ListFilter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by risk..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2" />
              New Permit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPermits.map((permit) => (
            <PermitCard
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
      <PermitForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onPermitCreated={handlePermitCreated}
      />
    </>
  );
}
