const KEY = 'studyData';

export const loadData = () => {
	const raw = localStorage.getItem(KEY);
	return raw ? JSON.parse(raw) : { subjects: [], sessions: [], goals: [] };
};

export const saveData = (data: any) => {
	localStorage.setItem(KEY, JSON.stringify(data));
};
