export enum CourseStatus {
	OPEN = 'OPEN',
	CLOSED = 'CLOSED',
	PAUSED = 'PAUSED',
}

export interface Course {
	id: string;
	name: string;
	lecturer: string;
	studentCount: number;
	description: string;
	status: CourseStatus;
}
