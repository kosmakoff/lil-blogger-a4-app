export interface Alert {
    type: AlertType;
    message: string;

    timeout: number | null;
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}
