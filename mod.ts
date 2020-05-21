/// <reference path="./deno.core.d.ts" />

const filename = `./target/debug/libtechshare_deno_plugin.dylib`;

// This will be checked against open resources after Plugin.close()
// in runTestClose() below.
const resourcesPre = Deno.resources();

const rid = Deno.openPlugin(filename);

const { fibAsync } = Deno.core.ops();
if (fibAsync <= 0) {
    throw "bad op id for fibAsync";
}

const convertNumberToUint8Array = function (long: number): Uint8Array {
    const byteArray = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);

    for (let index = 0; index < byteArray.length; index++) {
        const byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
    }

    return byteArray;
};

const convertUint8ArrayToNumber = function (byteArray: Uint8Array): number {
    let value = 0;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }

    return value;
};

Deno.core.setAsyncHandler(fibAsync, async response => {
    if (response) {
        const result = convertUint8ArrayToNumber(response);
        console.log(`Plugin Fib Async Res: ${result}`);
    }
});


const runFibAsync = function (): void {
    const num = 40;
    const u8array = convertNumberToUint8Array(num);
    const response = Deno.core.dispatch(
        fibAsync,
        new Uint8Array(u8array),
        undefined
    );

    if (response != null || response != undefined) {
        throw new Error("Expected null response!");
    }
    console.log(`Plugin Fib Async Req: ${num}`);
}

runFibAsync();

console.log(Deno.core);