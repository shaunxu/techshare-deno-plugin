import { Fib } from "./fib_lib.ts";

console.log(`Deno Process ID = ${Deno.pid}`);

const fib = new Fib();
const input = Number(Deno.args[0]);

{
    const output = fib.calculateSync(input);
    console.log(`Sync: fib(${input}) = ${output}`);
}

fib.calculate(input)
    .then(output => {
        console.log(`Async: fib(${input}) = ${output}`);
    })
    .catch(error => {
        console.log(error);
    });

console.log(`Finished`);
