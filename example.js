const { htmlToJson } = require("./dist");



// throw error because invalid css
console.log(htmlToJson(`
<div class="owo">
test
</div>


<style>
.owo {
  colorrrrr: red;
}
</style>
`))