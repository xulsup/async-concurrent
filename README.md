## Usage

```
const asyncConcurrent = require("async-concurrent");

const array = [] // requests
const concurrency = 10
const ret = await asyncConcurrent(array, async (item,index) => {
    // iterator
}, concurrency)
```
