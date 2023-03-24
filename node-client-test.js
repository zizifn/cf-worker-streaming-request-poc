import {
    ReadableStream,
    TextDecoderStream,
    TextEncoderStream,
  } from "node:stream/web";
//   import { fetch } from "undici";
  
  try {
    const readableStream = new ReadableStream({
      index: 0,
      start(controller) {
        const interval = setInterval(() => {
          controller.enqueue(`client send ${this.index++}`);
        }, 500);
  
        setTimeout(() => {
          clearInterval(interval);
          controller.close();
        }, 10_000);
      },
    }).pipeThrough(new TextEncoderStream());
  
    // const url = "http://localhost:3000/api/proxy2";
    // const url = "http://localhost:3000/api/edge";
    const url = "https://http2-test.zizifn.workers.dev/";
  
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: readableStream,
      duplex: "half",
    });
  
    for await (let chunk of resp.body.pipeThrough(new TextDecoderStream())) {
      console.log(chunk);
    }
  } catch (err) {
    console.log(err);
  }