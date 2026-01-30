// Task types for KOGITO Task System

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    user_id: string;
    content: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date?: string;
    source_entry_id?: string;
    created_at: string;
    completed_at?: string;
}

export interface CreateTaskInput {
    content: string;
    priority?: TaskPriority;
    due_date?: string;
    source_entry_id?: string;
}

export interface UpdateTaskInput {
    content?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
}

// Priority configuration with colors
export const PRIORITY_CONFIG = {
    low: { label: 'Low', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.2)' },
    medium: { label: 'Medium', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.2)' },
    high: { label: 'High', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.2)' }
} as const;

// Status configuration with colors
// Status configuration with colors
export const STATUS_CONFIG = {
    todo: { label: 'To Do', color: '#9CA3AF', icon: 'Circle' },
    done: { label: 'Done', color: '#10B981', icon: 'CheckCircle' }
} as const;
