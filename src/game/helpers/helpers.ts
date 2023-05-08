export const calculateGuestsToGenerate = (rate: number) => {
    let num = 0;
    while (rate > 0) {
        const rand = Math.random() * 100;
        if (rand <= rate) { num++ }
        rate -= 100;
    }
    return num;
}