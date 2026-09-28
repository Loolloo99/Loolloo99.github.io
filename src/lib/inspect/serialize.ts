/*
 * Trasforma un elemento della pagina nel codice mostrato dalla lente:
 * HTML (home e pagine senza dialetto), template del framework oppure COBOL.
 *
 * Attributi letti nelle pagine progetto:
 *   data-bind="title"          testo = variabile
 *   data-bind-join             la variabile è una lista da unire con ", "
 *   data-bind-html="description"  HTML non escapato
 *   data-bind-href="github"    (anche -src, -alt) attributo = variabile
 *   data-each="tags" data-as="tag"  ciclo sul primo figlio
 *   data-if="github" / "!github"    condizione
 *   data-include="nav"         parziale incluso
 */
import { tok, type AttributeDialect, type InlineDialect, type Ref } from "./dialects";

const HTML_ATTRS = ["id", "class", "href", "src", "alt", "role", "aria-label", "aria-selected", "aria-pressed", "data-lang", "data-fw"];
const VOID = new Set(["img", "svg", "br", "hr", "input", "source"]);
/** Oggetti disponibili nel template oltre a `project` */
const OBJECTS = new Set(["project", "language", "prev", "next"]);

export interface Budget {
  chars: number;
}

type MarkupDialect = InlineDialect | AttributeDialect;

const quoted = (name: string, value: string) => ` ${tok("attr", name)}${tok("punc", '="')}${tok("val", value)}${tok("punc", '"')}`;
const closeTag = (tag: string) => `${tok("punc", "</")}${tok("tag", tag)}${tok("punc", ">")}`;

function children(el: Element, budget: Budget, render: (child: Element) => string): string {
  const inPre = Boolean(el.closest("pre"));
  let inner = "";
  for (const node of el.childNodes) {
    if (budget.chars <= 0) {
      inner += tok("punc", "…");
      break;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      const text = inPre ? (node.textContent ?? "") : (node.textContent ?? "").replace(/\s+/g, " ");
      if (!text.trim()) continue;
      const cut = text.slice(0, budget.chars);
      budget.chars -= cut.length;
      inner += tok("text", cut);
    } else if (node instanceof Element) {
      inner += render(node);
    }
  }
  return inner;
}

// ---- HTML ----------------------------------------------------------------
export function htmlOpenTag(el: Element, selfClosing = false): string {
  const attrs = HTML_ATTRS.filter((name) => el.hasAttribute(name))
    .map((name) => quoted(name, el.getAttribute(name) ?? ""))
    .join("");
  return `${tok("punc", "<")}${tok("tag", el.tagName.toLowerCase())}${attrs}${tok("punc", selfClosing ? " />" : ">")}`;
}

export function serializeHtml(el: Element, budget: Budget, depth = 0): string {
  const tag = el.tagName.toLowerCase();
  if (VOID.has(tag)) return htmlOpenTag(el, true);
  // Nei blocchi di codice gli span dell'evidenziazione sono solo rumore: basta il testo
  if (tag === "pre") {
    const text = (el.textContent ?? "").slice(0, budget.chars);
    budget.chars -= text.length;
    return htmlOpenTag(el) + tok("text", text) + closeTag(tag);
  }
  const inner = children(el, budget, (child) => (depth < 3 ? serializeHtml(child, budget, depth + 1) : tok("punc", "…")));
  return htmlOpenTag(el) + inner + closeTag(tag);
}

// ---- Template del framework ----------------------------------------------
function toRef(path: string, loops: Set<string>): Ref {
  const [object, ...props] = path.split(".");
  if (loops.has(object) || (props.length > 0 && OBJECTS.has(object))) return { object, props };
  return { object: "project", props: path.split(".") };
}

function templateAttrs(el: Element, d: MarkupDialect, loops: Set<string>): string {
  const expr = (path: string) => d.expr(toRef(path, loops));
  let attrs = "";

  for (const name of HTML_ATTRS) {
    if (!el.hasAttribute(name)) continue;
    const bound = el.getAttribute(`data-bind-${name}`);
    const attrName = d.kind === "inline" && d.attrName ? d.attrName(name) : name;
    attrs += bound ? d.attr(attrName, expr(bound)) : quoted(attrName, el.getAttribute(name) ?? "");
  }

  const html = el.getAttribute("data-bind-html");
  if (d.kind === "attribute") {
    const condition = el.getAttribute("data-if");
    if (condition) attrs += d.when(expr(condition.replace(/^!/, "")), condition.startsWith("!"));
    const text = el.getAttribute("data-bind");
    if (text) attrs += el.hasAttribute("data-bind-join") ? d.join(expr(text)) : d.text(expr(text));
    if (html) attrs += d.raw(expr(html));
  } else if (html && d.rawAttr) {
    attrs += d.rawAttr(expr(html));
  }
  return attrs;
}

export function templateOpenTag(el: Element, d: MarkupDialect): string {
  return `${tok("punc", "<")}${tok("tag", el.tagName.toLowerCase())}${templateAttrs(el, d, new Set())}${tok("punc", ">")}`;
}

export function serializeTemplate(
  el: Element,
  d: MarkupDialect,
  budget: Budget,
  loops = new Set<string>(),
  extraAttrs = "",
  depth = 0,
): string {
  const include = el.getAttribute("data-include");
  if (include) return d.include(include);

  const tag = el.tagName.toLowerCase();
  const expr = (path: string) => d.expr(toRef(path, loops));
  const attrs = templateAttrs(el, d, loops) + extraAttrs;
  const text = el.getAttribute("data-bind");
  const html = el.getAttribute("data-bind-html");
  const each = el.getAttribute("data-each");

  let out: string;
  if (VOID.has(tag) || (html && d.kind === "inline" && d.rawAttr)) {
    out = `${tok("punc", "<")}${tok("tag", tag)}${attrs}${tok("punc", " />")}`;
  } else {
    let body = "";
    if (d.kind === "attribute" && (text || html)) {
      body = "";
    } else if (html && d.kind === "inline") {
      body = d.raw ? d.raw(expr(html)) : "";
    } else if (text && d.kind === "inline") {
      body = el.hasAttribute("data-bind-join") ? d.join(expr(text)) : d.text(expr(text));
    } else if (each) {
      const item = el.getAttribute("data-as") ?? "item";
      const list = expr(each);
      const child = el.firstElementChild;
      const scope = new Set([...loops, item]);
      if (d.kind === "attribute") {
        body = child ? serializeTemplate(child, d, budget, scope, d.each(list, item), depth + 1) : "";
      } else {
        const inner = child ? serializeTemplate(child, d, budget, scope, d.eachChildAttr?.(item) ?? "", depth + 1) : "";
        body = d.each(list, item, inner);
      }
    } else {
      body = children(el, budget, (child) =>
        depth < 4 ? serializeTemplate(child, d, budget, loops, "", depth + 1) : tok("punc", "…"),
      );
    }
    out = `${tok("punc", "<")}${tok("tag", tag)}${attrs}${tok("punc", ">")}${body}${closeTag(tag)}`;
  }

  const condition = el.getAttribute("data-if");
  if (condition && d.kind === "inline") out = d.when(expr(condition.replace(/^!/, "")), condition.startsWith("!"), out);
  return out;
}

// ---- COBOL -----------------------------------------------------------------
const COPYBOOKS: Record<string, string> = { nav: "NAVBAR", footer: "FOOTER", "code-preview": "CODE-PREVIEW" };

const cobolName = (ref: Ref) =>
  [ref.object, ...ref.props]
    .join("-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toUpperCase();

export function cobolLabel(el: Element): string {
  const name = (el.id || el.classList[0] || el.tagName).replace(/[_-]+/g, "-").toUpperCase();
  return `${tok("punc", "01 ")}${tok("var", name)}${tok("punc", ".")}`;
}

/** Campi di una SCREEN SECTION; riga e colonna derivano dalla posizione nella pagina */
export function serializeCobol(el: Element, top: number, left: number, budget: Budget): string {
  const include = el.getAttribute("data-include");
  if (include) return `${tok("tpl", "COPY ")}${tok("var", COPYBOOKS[include] ?? include.toUpperCase())}${tok("punc", ".")}`;

  const lines: string[] = [];
  const line = Math.round(top / 24) + 1;
  let col = Math.round(left / 9) + 1;
  const highlight = el.matches("h1, h2, h3") ? ` ${tok("tpl", "HIGHLIGHT")}` : "";

  const field = (clause: string, width: number) => {
    lines.push(
      `${tok("punc", "05 ")}${tok("tpl", "LINE ")}${tok("var", String(line))}${tok("tpl", " COL ")}${tok("var", String(col))} ${clause}${highlight}${tok("punc", ".")}`,
    );
    col += width + 1;
  };
  const comment = (text: string) => lines.push(tok("punc", `*> ${text}`));

  const walk = (node: Element) => {
    const name = (path: string) => cobolName(toRef(path, new Set()));
    const href = node.getAttribute("data-bind-href");
    if (href) comment(`LINK ${name(href)}`);
    const src = node.getAttribute("data-bind-src");
    if (src) comment(`IMMAGINE ${name(src)}`);

    const text = node.getAttribute("data-bind") ?? node.getAttribute("data-bind-html");
    if (text) {
      field(`${tok("tpl", "FROM ")}${tok("var", name(text))}`, (node.textContent ?? "").trim().length);
      return;
    }
    const each = node.getAttribute("data-each");
    if (each) {
      field(`${tok("tpl", "FROM ")}${tok("var", name(each))}${tok("tpl", " OCCURS ")}${tok("var", String(node.childElementCount))}${tok("tpl", " TIMES")}`, 20);
      return;
    }

    for (const child of node.childNodes) {
      if (budget.chars <= 0) break;
      if (child.nodeType === Node.TEXT_NODE) {
        const value = (child.textContent ?? "").replace(/\s+/g, " ").trim();
        if (!value) continue;
        budget.chars -= value.length;
        field(`${tok("tpl", "VALUE ")}${tok("val", `"${value}"`)}`, value.length);
      } else if (child instanceof Element && child.tagName.toLowerCase() !== "svg") {
        walk(child);
      }
    }
  };

  walk(el);
  return lines.join("\n") || `${tok("punc", "*> ")}${tok("var", el.tagName.toLowerCase())}`;
}
