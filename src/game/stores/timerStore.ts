import { create } from 'zustand';

interface TimerState {
    ticks: number;
    setTime: (time: number) => void;
    incrementTime: (increment: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
    ticks: 0,
    setTime: (time) => set({ ticks: time }),
    incrementTime: (increment) => set((state) => ({ ticks: state.ticks + increment })),
}));