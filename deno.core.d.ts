declare namespace Deno {
    export const core: {
        ops(): { [key: string]: number };
        dispatch(opId: number, control: Uint8Array, zeroCopy?: Uint8Array): ArrayBufferView | ArrayBuffer | undefined;
        setAsyncHandler(opId: number, cb: (response: Uint8Array) => void): void;
    }
}