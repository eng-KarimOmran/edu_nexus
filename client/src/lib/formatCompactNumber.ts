export function formatCompactNumber(value: number): string {
    return new Intl.NumberFormat("ar", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}