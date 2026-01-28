export const loadState = <T>(key: string, defaultValue: T): T => {
	try {
		const serializedState = localStorage.getItem(key);
		if (serializedState === null) {
			return defaultValue;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		console.error('Error loading state from localStorage:', err);
		return defaultValue;
	}
};

export const saveState = <T>(key: string, state: T): void => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(key, serializedState);
	} catch (err) {
		console.error('Error saving state to localStorage:', err);
	}
};
