export class DocEvents {
    private events: string[] = [];
    private callbacks: ((event: Event)=>void)[] = [];

    addEvent(eventName: string, callback: ((event: Event)=>void) | undefined) {
        if (eventName && callback) {
            this.events.push(eventName);
            this.callbacks.push(callback);
            document.addEventListener(eventName, callback);
        }
        return this;
    }

    unmount() {
        for (let i = 0; i < this.events.length; i++) {
            document.removeEventListener(this.events[i], this.callbacks[i]);
        }
    }
}