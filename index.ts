export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface Household {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface UserHousehold {
  id: number;
  userId: number;
  householdId: number;
  isAdmin: boolean;
  joinedAt: Date;
  household?: Household;
  user?: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  householdId: number;
  assignedToId?: number;
  createdById: number;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  completedById?: number;
  recurring?: 'never' | 'daily' | 'weekly' | 'monthly';
  sendReminder: boolean;
  createdAt: Date;
}

export interface TaskWithAssignee extends Task {
  assignee?: User;
}

export interface Activity {
  id: number;
  userId: number;
  householdId: number;
  type: 'task_completed' | 'task_created' | 'task_assigned';
  taskId?: number;
  metadata?: any;
  createdAt: Date;
  user?: User;
}

export interface StatsSummary {
  pendingCount: number;
  completedCount: number;
  weeklyProgress: number;
  pendingDiff: number;
  completedDiff: number;
}
