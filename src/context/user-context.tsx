'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { fetchEmployeeDetails } from '@/lib/employee-data';
import { fetchVisitorDetails } from '@/lib/visitor-data';
import type { Employee, Visitor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type AuthenticatedUser = Employee | Visitor;

interface UserContextType {
  user: AuthenticatedUser | null;
  login: (employeeCode: string, dob: string) => Promise<boolean>;
  loginVisitor: (visitorId: string, dob: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUserLocation: (lat: number, lng: number) => void;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.warn("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeCode: string, dob: string): Promise<boolean> => {
    setIsLoading(true);
    const employee = await fetchEmployeeDetails(employeeCode, dob);
    if (employee) {
      setUser(employee);
      localStorage.setItem('user', JSON.stringify(employee));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const loginVisitor = async (visitorId: string, dob: string): Promise<boolean> => {
    setIsLoading(true);
    const visitor = await fetchVisitorDetails(visitorId, dob);
    if (!visitor) {
      setIsLoading(false);
      return false;
    }

    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Location Not Supported',
        description: 'Your browser does not support geolocation. The QR pass cannot be generated.',
      });
      // Log in anyway, but without location.
      setUser(visitor);
      localStorage.setItem('user', JSON.stringify(visitor));
      setIsLoading(false);
      return true;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const locatedVisitor: Visitor = {
        ...visitor,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUser(locatedVisitor);
      localStorage.setItem('user', JSON.stringify(locatedVisitor));
      setIsLoading(false);
      return true;
    } catch (error) {
      let title = 'Location Error';
      let description = 'Could not get your location. The QR code cannot be generated without it.';

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                title = 'Location Access Denied';
                description = 'Please enable location permissions to generate a QR pass.';
                break;
            case error.POSITION_UNAVAILABLE:
                title = 'Location Unavailable';
                description = 'We could not determine your location, so the QR pass cannot be generated.';
                break;
            case error.TIMEOUT:
                title = 'Location Request Timed Out';
                description = 'Your device took too long to respond, so the QR pass cannot be generated.';
                break;
        }
      }

      toast({
        variant: 'destructive',
        title: title,
        description: description,
      });

      // Log the user in anyway, but without location data.
      setUser(visitor);
      localStorage.setItem('user', JSON.stringify(visitor));
      setIsLoading(false);
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const updateUserLocation = (lat: number, lng: number) => {
    setUser(currentUser => {
      if (!currentUser || currentUser.type !== 'visitor') {
        return currentUser;
      }
      const updatedVisitor: Visitor = {
        ...currentUser,
        lat,
        lng,
      };
      localStorage.setItem('user', JSON.stringify(updatedVisitor));
      return updatedVisitor;
    });
  };

  return (
    <UserContext.Provider value={{ user, login, loginVisitor, logout, isLoading, updateUserLocation }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
