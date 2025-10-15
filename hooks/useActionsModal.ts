import { useCallback, useState } from "react";

export function useActionsModal(initialVisible = false) {
	const [visible, setVisible] = useState<boolean>(initialVisible);

	const open = useCallback(() => setVisible(true), []);
	const close = useCallback(() => setVisible(false), []);
	const toggle = useCallback(() => setVisible((v) => !v), []);

	return { visible, open, close, toggle, setVisible };
}
