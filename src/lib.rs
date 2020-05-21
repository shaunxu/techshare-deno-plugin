use deno_core::plugin_api::Buf;
use deno_core::plugin_api::Interface;
use deno_core::plugin_api::Op;
use deno_core::plugin_api::ZeroCopyBuf;
use futures::future::FutureExt;
use std::convert::TryInto;

#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
  interface.register_op("fibAsync", op_fib);
}

fn fib(num: i32) -> i32 {
  if num == 1 || num == 2 {
    1
  } else {
    fib(num - 1) + fib(num - 2)
  }
}

fn op_fib(_interface: &mut dyn Interface, data: &[u8], _zero_copy: Option<ZeroCopyBuf>) -> Op {
  let (int_bytes, _) = data.split_at(std::mem::size_of::<i32>());
  let num = i32::from_ne_bytes(int_bytes.try_into().unwrap());
  let fut = async move {
    let (tx, rx) = futures::channel::oneshot::channel::<[u8; 4]>();
    std::thread::spawn(move || {
      let raw = fib(num);
      let output = raw.to_ne_bytes();
      tx.send(output).unwrap();
    });
    let result = rx.await.unwrap();
    let result_box: Buf = Box::new(result);
    result_box
  };
  Op::Async(fut.boxed())
}