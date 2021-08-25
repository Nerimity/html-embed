let doc: Document;
if (typeof document === "undefined") {
	try {
		const { JSDOM } = require("jsdom")
		doc = (new JSDOM().window).document
	} catch(err) {}
} else {
	doc = document
}



const allowTags = ['DIV', 'IMG', 'SPAN', 'STRONG', 'A']
const allowAttributes = ["href", "src", "color", "style"]
const allowCssProperties = [
  "display",
  "position",
  "backgroundColor",
  "backgroundImage",
  "backgroundRepeat",
  "backgroundSize",
  "backgroundPosition",
  "color",
  "top",
  "bottom",
  "left",
  "right",
  "width",
  "height",
  "minHeight",
  "minWidth",
  "maxHeight",
  "maxWidth",
  "border",
  "borderRadius",
  "boxShadow",
  "textShadow",
  "overflow",
  "textOverflow",
  "overflowWrap",
  "transition",
  "transform",
  "textDecoration",
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "flex",
  "flexShrink",
  "flexDirection",
  "gap",
  "flexGrow",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  "alignItems",
  "alignContent",
  "alignSelf",
  "whiteSpace",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "zIndex",
  "textAlign",
  "borderColor",
  "verticalAlign",
  "lineHeight",
  "backdropFilter",
  "backgroundClip"


]


export function checkHTML(html: string) {
  if (!doc) {
    throw new Error("jsdom is required.")
  }
  const mainElement = doc.createElement("body");
  mainElement.innerHTML = html;

  const tags = mainElement.getElementsByTagName('*');

  

  for (let index = 0; index < tags.length; index++) {
    const tag = tags[index];
    // check if tag is whitelisted
    if (!allowTags.includes(tag.tagName)) {
      throw new Error(tag.tagName + " tag is not allowed!")
    }
    // check if attribute is whitelisted
    for (let y = 0; y < tag.attributes.length; y++) {
      const { name, value } = tag.attributes[y];
      if (!allowAttributes.includes(name)) {
        throw new Error(name + " attribute is not allowed!")
      }
    }
    // check styles
    const styles = tag.getAttribute("style")?.split(";");
    if (styles) {
      for (let x = 0; x < styles.length; x++) {
        const [key, value] = styles[x].split(":");
        if (!key.trim()) continue;
        if (!allowCssProperties.includes(cssNameToJsName(key.trim()))) {
          throw new Error(key.trim() + " style is not allowed!")
        }

      }
    }
  }
  return mainElement.innerHTML;
}

function cssNameToJsName(name: string) {
  var split = name.split("-");
  var output = "";
  for (var i = 0; i < split.length; i++) {
    if (i > 0 && split[i].length > 0 && !(i == 1 && split[i] == "ms")) {
      split[i] = split[i].substr(0, 1).toUpperCase() + split[i].substr(1);
    }
    output += split[i];
  }
  return output;
}