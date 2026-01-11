import htm from 'htm';
import css from 'css';
import * as htmlparser2 from "htmlparser2";
const {validate} = require("csstree-validator")


const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'img', 'span', 'strong', 'a', "style", "p", "ul", "li", "ol", "table", "thead", "tbody", "tr", "td", "th", "blockquote", "pre", "br", 'b', 'i', 'u', 'em', 'small', 'mark', 'sub', 'sup', 'code', 'hr', 'section', 'article', 'header', 'footer', 'nav'];
const allowedAttributes = ["href", "src", "color", "style", "class"]
const allowedCssProperties = [
  "opacity",
  "background-clip",
  "-webkitBackgroundClip",
  "-webkitTextFillColor",
  "display",
  "position",
  "inset",
  "background",
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
  "flexWrap",
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
  "filter",
  "objectFit",
  "backgroundClip",
  "cursor",
  "overflowX",
  "overflowY",
  "userSelect",
  "pointerEvents",
]


function h(tag: string, props: any, ...children: any[]) {
  // check if tag is safe
  if (!allowedTags.includes(tag.toLowerCase())) {
    throw new Error(tag+" tag is not allowed!")
  }
  // check if attributes are safe
  if (props) {
    const unsafeAttribute = Object.keys(props).find(prop => !allowedAttributes.includes(prop));
    if (unsafeAttribute) {
      throw new Error(unsafeAttribute+" attribute is not allowed!")
    }
  }
  // check if styles are safe
  if (props?.style) {
    const styles: string[] = props.style.split(";");
    const unsafeCssProperty = styles.find(style => {
      if (style === "") return false;
      const keyVal = style.split(":")
      const key = keyVal[0].trim()
      const value = keyVal[1].trim()
      if (key === "position" && value === "fixed") {
        throw new Error(value + " value is not allowed for "+ key + "!")
      }
      return !allowedCssProperties.includes(cssNameToJsName(key))
    })
    if (unsafeCssProperty) {
      throw new Error(unsafeCssProperty.split(":")[0].trim() +" property is not allowed!")
    }
  }
  if (props?.href) {
    if (!props.href.startsWith("http://") && !props.href.startsWith("https://")) {
      throw new Error("href must start with http:// or https://")
    }
  }
  if (tag.toLowerCase() === "style" && children[0]) {
    checkCSS(children[0]);
  }
  
  return { tag, attributes: props, content: children };
}

const _html = htm.bind(h);



export function htmlToJson(html: string) {
  validateHtmlStructure(html);
  return _html([html] as any)
}


function validateHtmlStructure(html: string) {
  let isMalformed = false;
  const parser = new htmlparser2.Parser(
    {
      onerror(error) {
        isMalformed = true;
      },
    },
    { decodeEntities: true, lowerCaseTags: true }
  );

  parser.write(html);
  parser.end();

  if (isMalformed) {
    throw new Error("Invalid HTML structure detected.");
  }

  const openTags = (html.match(/<[a-zA-Z0-9]+/g) || []).length;
  const closeTags = (html.match(/<\/[a-zA-Z0-9]+/g) || []).length;
  
  const expectedCloseTags = openTags - (html.match(/<(img|br|hr)/g) || []).length;

  if (expectedCloseTags !== closeTags) {
    throw new Error("Mismatched or unclosed HTML tags.");
  }
}


function checkCSS(cssVal: string) {
  if (validate(cssVal).length) {
    throw new Error("Invalid css!")
  }
  const openCurlyBracketCount = cssVal.match(/{/gi)
  const closeCurlyBracketCount = cssVal.match(/}/gi)
  if (openCurlyBracketCount?.length !== closeCurlyBracketCount?.length) {
    throw new Error("Extra curly or missing curly brackets found in css!")
  }
  const rules = css.parse(cssVal).stylesheet?.rules;
  if (!rules) return;
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const declarations = (rule as any).declarations;
    for (let x = 0; x < declarations.length; x++) {
      const {property, value} = declarations[x];
      if (!allowedCssProperties.includes(cssNameToJsName(property))) {
        throw new Error(property + " style is not allowed!")
      }
      if (property === "position" && value === "fixed") {
        throw new Error(value + " value is not allowed for "+ property + "!")
      }
    }
    
  }
}


function cssNameToJsName(name: string) {
  var split = name.split("-").filter(n => n);
  var output = "";
  for (var i = 0; i < split.length; i++) {
    if (i > 0 && split[i].length > 0 && !(i == 1 && split[i] == "ms")) {
      split[i] = split[i].substring(0, 1).toUpperCase() + split[i].substring(1);
    }
    output += split[i];
  }
  if (name.startsWith("-")) {
    output = "-" + output
  }
  return output;
}

function jsNameToCssName(name: string)
{
    return name.replace(/([A-Z])/g, "-$1").toLowerCase();
}
