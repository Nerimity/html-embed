const { htmlToJson } = require("./dist");



// throw error because invalid css
console.log(htmlToJson(`
<div class="owo">
test
<a href="https:google.com">test</a>
</div>


<style>
.owo {
  color: red;
}
</style>
`))