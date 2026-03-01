export const startOfDay = (d: Date) => new Date(d.setHours(0, 0, 0, 0));

export const endOfDay = (d: Date) => new Date(d.setHours(23, 59, 59, 999));
