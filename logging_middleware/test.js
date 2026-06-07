const Log = require("./logger");

async function test() {
    await Log(
        "backend",
        "info",
        "middleware",
        "Logging middleware initialized"
    );

    console.log("Done");
}

test();