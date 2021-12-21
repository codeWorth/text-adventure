export function nonNull<T>(...items: (T | undefined)[]): T[] {
    return items.flatMap(item => item !== undefined ? [item] : []);
}

export function map<T, O>(item: T | undefined, mapper:(val: T) => O) {
    return item !== undefined ? mapper(item) : undefined;
}