export interface Subject {
	id: number;
	name: string;
}

export interface StudySession {
	id: number;
	subjectId: number;
	date: string;
	duration: number; // phút
	content: string;
	note?: string;
}

export interface Goal {
	id: number;
	month: string; // 2026-03
	subjectId?: number;
	targetHours: number;
}
