import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { TOAST_LIMIT, TOAST_DURATION } from '../utils/constants';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (message, type = 'success', duration = TOAST_DURATION) => {
    const id = uuidv4();

    set((state) => {
      const nextToasts = [...state.toasts, { id, message, type, duration }];
      const limitedToasts = nextToasts.length > TOAST_LIMIT ? nextToasts.slice(-TOAST_LIMIT) : nextToasts;
      return { toasts: limitedToasts };
    });

    if (duration !== Infinity) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },
}));
