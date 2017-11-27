import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>('localStorage');

export class DummyStorage implements Storage {
    [index: number]: string;
    [key: string]: any;
    length: number;
    clear(): void {
        // do nothing
    }
    getItem(key: string): string {
        return null;
    }
    key(index: number): string {
        return null;
    }
    removeItem(key: string): void {
        // do nothing
    }
    setItem(key: string, data: string): void {
        // do nothing
    }
}
