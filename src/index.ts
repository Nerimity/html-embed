import htm from 'htm';
import css from 'css';


const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'img', 'span', 'strong', 'a', "style", "p", "ul", "li", "ol", "table", "thead", "tbody", "tr", "td", "th", "blockquote", "pre", "br"]
const allowedAttributes = ["href", "src", "color", "style", "class"]
const allowedCssProperties = [
  "display",
  "position",
  "inset",
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
  if (tag.toLowerCase() === "style" && children[0]) {
    checkCSS(children[0]);
  }
  
  return { tag, attributes: props, content: children };
}

const _html = htm.bind(h);



export function htmlToJson(html: string) {
  return _html([html] as any)
}



function checkCSS(cssVal: string) {
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

function jsNameToCssName(name: string)
{
    return name.replace(/([A-Z])/g, "-$1").toLowerCase();
}