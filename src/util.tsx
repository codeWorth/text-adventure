export function nonNull<T>(...items: (T | undefined)[]): T[] {
    return items.flatMap(item => item ? [item] : []);
}

export function map<T, O>(item: T | undefined, mapper:(val: T) => O) {
    return item ? mapper(item) : undefined;
}