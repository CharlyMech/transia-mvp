import { useDriversStore } from '@/stores/useDriversStore';
import { useFleetStore } from '@/stores/useFleetStore';
import { useReportsStore } from '@/stores/useReportsStore';
import React, { useEffect } from 'react';

interface StoreInitializerProps {
	children: React.ReactNode;
}

export function StoreInitializer({ children }: StoreInitializerProps) {
	const fetchReports = useReportsStore((state) => state.fetchReports);
	const fetchDrivers = useDriversStore((state) => state.fetchDrivers);
	const fetchFleet = useFleetStore((state) => state.fetchFleet);

	useEffect(() => {
		Promise.all([
			fetchReports(),
			fetchDrivers(),
			fetchFleet(),
		]).catch((error) => {
			console.error('Error initializing stores:', error);
		});
	}, [fetchReports, fetchDrivers, fetchFleet]);

	return <>{children}</>;
}