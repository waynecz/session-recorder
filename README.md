# Session Recorder

See also [Session-Player(developing)](https://github.com/waynecz/session-player) for consuming Recorder's data

### Record list:
+ DOM mutation
+ Network(xhr, fetch, beacon)
+ Global Error, Unhandled rejection
+ Mouse, Scroll
+ Console

### Output like:
```json
[
  { "t": 1, "type": "node", "add": [{ "html": "<div id=\"__tr__\"></div>" }], "target": 6 },
  { "t": 2, "type": "form", "target": 16, "k": "value", "v": "2312" },
  { "t": 3, "type": "attr", "target": 14, "attr": { "k": "class", "v": "a" } },
  { "t": 4, "type": "scroll", "x": 0, "y": 10 },
  { "t": 4.5, "type": "click", "x": 71, "y": 13 },
  { "t": 5, "type": "form", "target": 19, "k": "checked", "v": true },
  { "t": 6, "type": "jserr", "msg": "Type Error: ...", "url": "...", "err": "..." },
  { "t": 7, "type": "xhr", "url": "...", "method": "GET", "id": "21asdcxz" },
  { "t": 8, "type": "xhrend", "status": 503, "id": "21asdcxz" },
  { "t": 8.5, "type": "move", "x": 38, "y": 510 },
  { "t": 9, "type": "console", "l": "warn", "msg": "..." }
]


```

### Code intergration:
```javascript
import Recorder from '@wayne/session-recorder'

const myReocrder = new Recorder()

myReocrder.start() // start record
myReocrder.end() // stop record
```

<br>

### TODO
+ [ ] VDOM
+ [ ] Using WebWorker store trail data

<br>

### Build Setup
```shell
# serve file with hot reload at http://localhost:8000/index.js
npm run dev

# build with tsc, complie into ESModule
npm run build
```

<br>

### Document (constructing)