import { create } from 'zustand';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types/task';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTasks: () => Promise<void>;
    addTask: (input: CreateTaskInput) => Promise<Task | null>;
    updateTask: (id: string, updates: UpdateTaskInput) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleComplete: (id: string) => Promise<void>;

    // Computed getters
    getTodoTasks: () => Task[];
    getDoneTasks: () => Task[];
    getTaskCount: () => { todo: number; done: number; total: number };
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/tasks');
            if (!res.ok) {
                throw new Error(`Failed to fetch tasks (${res.status})`);
            }
            const data = await res.json();
            set({ tasks: data.tasks || [], isLoading: false });
        } catch (err: any) {
            console.error("Failed to fetch tasks:", err);
            set({ error: err.message, isLoading: false });
        }
    },

    addTask: async (input: CreateTaskInput) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Task creation failed (API):", errorData);
                throw new Error(errorData.details || errorData.error || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (data.task) {
                set(state => ({ tasks: [data.task, ...state.tasks] }));
                return data.task;
            }
            return null;
        } catch (err: any) {
            console.error("Failed to add task:", err);
            set({ error: err.message });
            return null;
        }
    },

    updateTask: async (id: string, updates: UpdateTaskInput) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to update task (${res.status})`);
            }

            const data = await res.json();

            if (data.task) {
                set(state => ({
                    tasks: state.tasks.map(t => t.id === id ? data.task : t)
                }));
            }
        } catch (err: any) {
            console.error("Failed to update task:", err);
            set({ error: err.message });
        }
    },

    deleteTask: async (id: string) => {
        try {
            const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to delete task (${res.status})`);
            }

            set(state => ({
                tasks: state.tasks.filter(t => t.id !== id)
            }));
        } catch (err: any) {
            console.error("Failed to delete task:", err);
            set({ error: err.message });
        }
    },

    toggleComplete: async (id: string) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
        await get().updateTask(id, { status: newStatus });
    },

    // Computed getters
    getTodoTasks: () => get().tasks.filter(t => t.status === 'todo'),
    getDoneTasks: () => get().tasks.filter(t => t.status === 'done'),
    getTaskCount: () => {
        const tasks = get().tasks;
        return {
            todo: tasks.filter(t => t.status === 'todo').length,
            done: tasks.filter(t => t.status === 'done').length,
            total: tasks.length
        };
    }
}));
