import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const randomBackgroundColor = (displayLetter: string | undefined): ClassValue => {
    const firstCharValue = (displayLetter ? displayLetter[0] ?? "?" : "A").charCodeAt(0)

    //standard to light gradient
    const colorClasses1 = {
        gray: "bg-gradient-to-br from-stone-700 to stone-600",
        red: "bg-gradient-to-br from-red-700 to-red-600",
        orange: "bg-gradient-to-br from-orange-700 to-orange-600",
        yellow: "bg-gradient-to-br from-yellow-700 to-yellow-600",
        teal: "bg-gradient-to-br from-teal-700 to-teal-600",
        blue: "bg-gradient-to-br from-blue-700 to-blue-600",
        indigo: "bg-gradient-to-br from-indigo-700 to-indigo-600",
        purple: "bg-gradient-to-br from-purple-700 to-purple-600",
        pink: "bg-pink-700",
    }
    //standard to dark gradient
    const colorClasses2 = {
        gray: "bg-gradient-to-br from-stone-700 to stone-800",
        red: "bg-gradient-to-br from-red-700 to-red-800",
        orange: "bg-gradient-to-br from-orange-700 to-orange-800",
        yellow: "bg-gradient-to-br from-yellow-700 to-yellow-800",
        teal: "bg-gradient-to-br from-teal-700 to-teal-800",
        blue: "bg-gradient-to-br from-blue-700 to-blue-800",
        indigo: "bg-gradient-to-br from-indigo-700 to-indigo-800",
        purple: "bg-gradient-to-br from-purple-700 to-purple-800",
        pink: "bg-gradient-to-br from-pink-700 to-pink-800",
    }

    // Get a random color from the colorClasses object
    return Object.values(colorClasses1)[
        Math.floor(firstCharValue % Object.values(colorClasses1).length)
    ] ?? "bg-stone-700"


}