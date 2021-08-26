const { checkHTML } = require("./dist");



// throw error because invalid css
console.log(checkHTML(`
<div class="owo">
test
</div>


<style>
.owo {
  colorr: red;
}
</style>
`))