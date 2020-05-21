/// <reference path="./deno.core.d.ts" />

export class Fib {

    private _opIdFibAsync: number;

    constructor() {
        Deno.openPlugin(`./target/debug/libtechshare_deno_plugin.dylib`);
        const { fibAsync } = Deno.core.ops();
        if (fibAsync > 0) {
            this._opIdFibAsync = fibAsync;
            Deno.core.setAsyncHandler(this._opIdFibAsync, this.asyncHandler);
        }
        else {
            throw new Error(`Failed to load op "fibAsync" from the plugin`);
        }
    }

    private static convertNumberToUint8Array(long: number): Uint8Array {
        const byteArray = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
        for (let index = 0; index < byteArray.length; index++) {
            const byte = long & 0xff;
            byteArray[index] = byte;
            long = (long - byte) / 256;
        }
        return byteArray;
    }

    private static convertUint8ArrayToNumber = function (byteArray: Uint8Array): number {
        let value = 0;
        for (var i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
        return value;
    }

    private asyncHandler(response: Uint8Array): void {
        if (response) {
            const result = Fib.convertUint8ArrayToNumber(response);
            console.log(result);
        }
        else {
            throw new Error("Empty response");
        }
    }

    public calculate(num: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            Deno.core.setAsyncHandler(this._opIdFibAsync, response => {
                if (response) {
                    const result = Fib.convertUint8ArrayToNumber(response);
                    return resolve(result);
                }
                else {
                    return reject("Empty response");
                }
            });

            const u8array = Fib.convertNumberToUint8Array(num);
            const response = Deno.core.dispatch(this._opIdFibAsync, u8array);
            if (response != null || response != undefined) {
                return reject("Expected null response directly from async call");
            }
        });
    }
}
