import { Fib } from "./fib_lib.ts";

const fib = new Fib();

const input = Number(Deno.args[0]);
fib.calculate(input)
    .then(output => {
        console.log(`Async: fib(${input}) = ${output}`);
    })
    .catch(error => {
        console.log(error);
    });

console.log("Sync: Hello Deno and Rust 🦕🦕🦕");
