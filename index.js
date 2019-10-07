const req = require('./src/require')

let string = req('./src/example.js')
string = req('./src/example.js')
const json = req('./src/example.json')
console.log(string)
console.log(json)