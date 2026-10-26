export type WebUSBTransport = 'auto' | 'webserial' | 'webusb';

export type WebUSBLogger =
    | ((...args: unknown[]) => void)
    | { log: (...args: unknown[]) => void }
    | null;

export declare class WebUSBSerial {
    static requestPort(
        logger?: WebUSBLogger,
        forceNew?: boolean,
        isAndroid?: boolean
    ): Promise<SerialPort>;
}

export declare function requestSerialPort(
    forceNew?: boolean,
    transport?: WebUSBTransport,
    logMsg?: ((message: string) => void) | null
): Promise<SerialPort>;