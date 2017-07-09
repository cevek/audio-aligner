export class Cache<K, V> {
    cache = new Map<K, { created: number, ttl: number, data: V }>();
    protected readCount = 0;
    protected disabled = false;

    constructor(public clearOldEveryRead = 5) {}

    setDisabled(disabled: boolean) {
        this.disabled = disabled;
    }

    clearOld() {
        this.cache.forEach((value, key) => {
            if (Date.now() - value.created > value.ttl) {
                this.cache.delete(key);
            }
        });
    }

    read(key: K) {
        this.readCount++;
        if (this.readCount % this.clearOldEveryRead === 0) {
            this.clearOld();
        }
        if (this.disabled) return null;
        const result = this.cache.get(key);
        if (result && Date.now() - result.created < result.ttl) {
            return result.data;
        }
        return null;
    }

    write(key: K, value: V, ttl: number) {
        if (this.disabled) return value;
        this.cache.set(key, {created: Date.now(), ttl: ttl * 1000, data: value});
        return value;
    }
}