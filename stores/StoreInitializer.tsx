import { useAuthStore } from '@/stores/useAuthStore';
import { useDriversStore } from '@/stores/useDriversStore';
import { useFleetStore } from '@/stores/useFleetStore';
import { useReportsStore } from '@/stores/useReportsStore';
import { useTimeRegistrationsStore } from '@/stores/useTimeRegistrationStore';
import React, { useEffect } from 'react';

interface StoreInitializerProps {
	children: React.ReactNode;
}

export function StoreInitializer({ children }: StoreInitializerProps) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const user = useAuthStore((state) => state.user);
	const fetchReports = useReportsStore((state) => state.fetchReports);
	const fetchDrivers = useDriversStore((state) => state.fetchDrivers);
	const fetchFleet = useFleetStore((state) => state.fetchFleet);
	const fetchTimeRegistrations = useTimeRegistrationsStore((state) => state.fetchRegistrationsByDriver);

	useEffect(() => {
		if (isAuthenticated && user?.id) {
			Promise.all([
				fetchReports(),
				fetchDrivers(),
				fetchFleet(),
				fetchTimeRegistrations(user.id),
			]).catch((error) => {
				console.error('Error initializing stores:', error);
			});
		}
	}, [isAuthenticated, user?.id, fetchReports, fetchDrivers, fetchFleet, fetchTimeRegistrations]);

	return <>{children}</>;
}