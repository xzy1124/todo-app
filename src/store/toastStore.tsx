// store/toastStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ToastItem {
    id: number;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
}

interface ToastState {
    toasts: ToastItem[];
    addToast: (message: string, type?: ToastItem['type']) => void;
    removeToast: (id: number) => void;
    clearToasts: () => void;
}

export const useToastStore = create<ToastState>()(
    persist(
        (set) => ({
            toasts: [],
            addToast: (message, type) =>
                set((state) => ({
                    toasts: [
                        ...state.toasts,
                        { id: Date.now(), message, type }
                    ]
                })),
            removeToast: (id) =>
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id)
                })),
            clearToasts: () => set({ toasts: [] })
        }),
        {
            name: 'toast-storage', // 可选：存 localStorage
        }
    )
);
