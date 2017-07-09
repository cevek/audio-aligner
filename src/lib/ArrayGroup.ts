export interface ArrayGroup<T> {
    key: string;
    item: T;
    items: T[];
}
export function arrayGroup<T>(items: T[], groupKey: (item: T) => string, skipNullGroupKey = false): ArrayGroup<T>[] {
    const map = new Map<string, T[]>();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const key = groupKey(item);
        if (skipNullGroupKey && (key === null || key === void 0)) {
            continue;
        }
        let group = map.get(key);
        if (!group) {
            group = [];
            map.set(key, group);
        }
        group.push(item);
    }
    const arr: ArrayGroup<T>[] = [];
    map.forEach((value, key) => {
        arr.push({ key, items: value, item: value[0] });
    });
    return arr;
}