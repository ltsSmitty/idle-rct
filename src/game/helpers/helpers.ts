export const calculateGuestsToGenerate = (rate: number) => {
    // doing 1 - Math.random so that we get 1 included in the range
    const generatedValue = (rate * (1 - Number(Math.random().toFixed(2))));
    console.log(`Generated value: ${generatedValue}`)
    return Math.floor(generatedValue)
}