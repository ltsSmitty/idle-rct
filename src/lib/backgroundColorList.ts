import { type ClassValue } from "clsx"

const bgColorClasses = {
    gray: "bg-stone-700 hover:bg-stone-600",
    red: "bg-red-700 hover:bg-red-600",
    orange: "bg-orange-700 hover:bg-orange-600",
    yellow: "bg-yellow-700 hover:bg-yellow-600",
    teal: "bg-teal-700 hover:bg-teal-600",
    blue: "bg-blue-700 hover:bg-blue-600",
    indigo: "bg-indigo-700 hover:bg-indigo-600",
    purple: "bg-700 hover:bg-purple-600",
    pink: "bg-pink-700 hover:bg-pink-600",
    cyan: "bg-cyan-700 hover:bg-cyan-600",
}



export const randomBackgroundColor = (displayLetter: string | undefined): ClassValue => {
    const firstCharValue = (displayLetter ? displayLetter[0] ?? "?" : "A").charCodeAt(0)

    // Get a random color from the colorClasses object
    return Object.values(bgColorClasses)[
        Math.floor(firstCharValue % Object.values(bgColorClasses).length)
    ] ?? "bg-stone-600"
}