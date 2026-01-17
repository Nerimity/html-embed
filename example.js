const { htmlToJson } = require("./dist");



// throw error because invalid css
console.log(htmlToJson(`
<dIv class="owo" style="owo: lol"; onclick="Lol">
  <br />
</dIv>

`))