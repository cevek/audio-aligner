export class LocalStorageValue<T> {
    protected static storeAvail = false;
    protected value: T;
    protected valueString: string;
    protected static storageChecked = false;

    static onError: ((err: Error) => void) | undefined = void 0;

    constructor(protected name: string, protected factory: () => T) {
        if (!LocalStorageValue.storageChecked) {
            LocalStorageValue.checkLocalStorage();
            LocalStorageValue.storageChecked = true;
            window.addEventListener('storage', this.onStorageChange);
        }
    }

    protected onStorageChange = (event: StorageEvent) => {
        if (event.key == this.name) {
            this._get();
        }
    };

    protected static checkLocalStorage() {
        const test = Math.random().toString(32);
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            LocalStorageValue.storeAvail = true;
        } catch (e) {
            LocalStorageValue.catchError(e);
        }
    }

    protected static catchError(err: Error) {
        if (LocalStorageValue.onError) {
            LocalStorageValue.onError(err);
        } else {
            setTimeout(() => {
                throw err;
            });
        }
    }

    set (value: T) {
        if (LocalStorageValue.storeAvail && JSON.stringify(value) !== this.valueString) {
            this._set(value);
        }
        this.value = value;
    }

    protected _set(value: T) {
        // console.log("Save", this.name, this.value);
        try {
            localStorage.setItem(this.name, JSON.stringify(value));
        } catch (e) {
            LocalStorageValue.catchError(e);
        }
    }

    get (force?: boolean) {
        if (LocalStorageValue.storeAvail && (this.value === void 0 || force)) {
            this._get();
        }
        return this.value;
    }

    protected _get() {
        try {
            this.valueString = localStorage.getItem(this.name) || 'null';
            this.value = JSON.parse(this.valueString);
            if (this.value === null) {
                this.value = this.factory();
            }
        } catch (e) {
            LocalStorageValue.catchError(e);
        }
        // console.log("Read", this.name, this.value);
    }
}