export function nonNull<T>(...items: (T | undefined)[]): T[] {
    return items.flatMap(item => item !== undefined ? [item] : []);
}

export function map<T, O>(item: T | undefined, mapper:(val: T) => O) {
    return item !== undefined ? mapper(item) : undefined;
}

export function assertUnreachable(value: never): never {
    throw new Error("Unreachable");
}

export function passFirst<T>(firstParam: T, fn: (first: T, ...params: any[]) => any) {
    return (...params: any[]) => fn(firstParam, ...params);
}

export function any(bools: boolean[]): boolean {
    return bools.some(b => b);
}

export function none(bools: boolean[]): boolean {
    return !any(bools);
}

export function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}