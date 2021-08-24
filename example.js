const { checkHTML } = require("./dist");




// throws error because style could be unsafe.
console.log(checkHTML(`
<div style="unknown-style: owo;">owo</div>
`))

// throws error
console.log(checkHTML(`
<div onclick="alert(1)">owo</div>
`))

// returns true: is safe to use.
console.log(checkHTML(`
<div style="color: red">owo</div>
`))

