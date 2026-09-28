/*
 * Dialetti della modalità inspect code nelle pagine progetto: la lente mostra ogni
 * elemento come sarebbe scritto nel template del framework del progetto.
 * È codice illustrativo, non il sorgente reale del sito né del progetto.
 */

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ESCAPES[c]);

/** Frammento evidenziato: tag, attr, val, punc, text, tpl (sintassi del template), var (dati) */
export const tok = (cls: string, text: string) => `<span class="x-${cls}">${esc(text)}</span>`;

/** Riferimento a un dato: project.title, language.name, tag... */
export interface Ref {
  object: string;
  props: string[];
}

interface Common {
  label: string;
  short: string;
}

/** Template con le espressioni nel testo (Blade, JSX, Django...) */
export interface InlineDialect extends Common {
  kind: "inline";
  expr: (ref: Ref) => string;
  attrName?: (name: string) => string;
  text: (expr: string) => string;
  raw?: (expr: string) => string;
  /** Alternativa a `raw`: attributo che rende l'elemento auto-chiuso (JSX) */
  rawAttr?: (expr: string) => string;
  join: (expr: string) => string;
  attr: (name: string, expr: string) => string;
  each: (list: string, item: string, inner: string) => string;
  eachChildAttr?: (item: string) => string;
  when: (expr: string, negate: boolean, inner: string) => string;
  include: (name: string) => string;
}

/** Template con le direttive negli attributi (Thymeleaf) */
export interface AttributeDialect extends Common {
  kind: "attribute";
  expr: (ref: Ref) => string;
  text: (expr: string) => string;
  raw: (expr: string) => string;
  join: (expr: string) => string;
  attr: (name: string, expr: string) => string;
  each: (list: string, item: string) => string;
  when: (expr: string, negate: boolean) => string;
  include: (name: string) => string;
}

export interface CobolDialect extends Common {
  kind: "cobol";
}

export type Dialect = InlineDialect | AttributeDialect | CobolDialect;

// ---- Helper ---------------------------------------------------------
const wrap = (open: string, body: string, close: string) => tok("tpl", open) + tok("var", body) + tok("tpl", close);
const quotedAttr = (name: string, value: string) => ` ${tok("attr", name)}${tok("punc", '="')}${value}${tok("punc", '"')}`;
const exprAttr = (name: string, value: string) => ` ${tok("attr", name)}${tok("punc", "=")}${value}`;
const dotted = (ref: Ref) => [ref.object, ...ref.props].join(".");
const arrow = (ref: Ref) => `$${ref.object}${ref.props.map((p) => `->${p}`).join("")}`;
const camel = (name: string) => name.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
const pascal = (name: string) => camel(name).replace(/^\w/, (c) => c.toUpperCase());

// ---- Dialetti ---------------------------------------------------------
const blade: InlineDialect = {
  kind: "inline",
  label: "Laravel Blade",
  short: "Blade",
  expr: arrow,
  text: (e) => wrap("{{ ", e, " }}"),
  raw: (e) => wrap("{!! ", e, " !!}"),
  join: (e) => wrap("{{ ", `implode(', ', ${e})`, " }}"),
  attr: (name, e) => quotedAttr(name, wrap("{{ ", e, " }}")),
  each: (list, item, inner) => wrap("@foreach (", `${list} as $${item}`, ")") + inner + tok("tpl", "@endforeach"),
  when: (e, negate, inner) => wrap("@if (", negate ? `! ${e}` : e, ")") + inner + tok("tpl", "@endif"),
  include: (name) => wrap("@include(", `'partials.${name}'`, ")"),
};

const php: InlineDialect = {
  kind: "inline",
  label: "PHP",
  short: "PHP",
  expr: arrow,
  text: (e) => wrap("<?= ", `htmlspecialchars(${e})`, " ?>"),
  raw: (e) => wrap("<?= ", e, " ?>"),
  join: (e) => wrap("<?= ", `implode(', ', ${e})`, " ?>"),
  attr: (name, e) => quotedAttr(name, wrap("<?= ", `htmlspecialchars(${e})`, " ?>")),
  each: (list, item, inner) => wrap("<?php foreach (", `${list} as $${item}`, "): ?>") + inner + tok("tpl", "<?php endforeach; ?>"),
  when: (e, negate, inner) => wrap("<?php if (", negate ? `!${e}` : e, "): ?>") + inner + tok("tpl", "<?php endif; ?>"),
  include: (name) => wrap("<?php include ", `'partials/${name}.php'`, "; ?>"),
};

const jsx: InlineDialect = {
  kind: "inline",
  label: "React JSX",
  short: "JSX",
  expr: dotted,
  attrName: (name) => (name === "class" ? "className" : name),
  text: (e) => wrap("{", e, "}"),
  rawAttr: (e) => exprAttr("dangerouslySetInnerHTML", wrap("{{ __html: ", e, " }}")),
  join: (e) => wrap("{", `${e}.join(", ")`, "}"),
  attr: (name, e) => exprAttr(name, wrap("{", e, "}")),
  each: (list, item, inner) => wrap("{", `${list}.map((${item}) => (`, "") + inner + tok("tpl", "))}"),
  eachChildAttr: (item) => exprAttr("key", wrap("{", item, "}")),
  when: (e, negate, inner) => wrap("{", `${negate ? "!" : ""}${e} && (`, "") + inner + tok("tpl", ")}"),
  include: (name) => tok("punc", "<") + tok("tag", pascal(name)) + exprAttr("project", wrap("{", "project", "}")) + tok("punc", " />"),
};

const templateLiteral: InlineDialect = {
  kind: "inline",
  label: "JavaScript",
  short: "JS",
  expr: dotted,
  text: (e) => wrap("${", e, "}"),
  raw: (e) => wrap("${", `unsafeHTML(${e})`, "}"),
  join: (e) => wrap("${", `${e}.join(", ")`, "}"),
  attr: (name, e) => quotedAttr(name, wrap("${", e, "}")),
  each: (list, item, inner) => wrap("${", `${list}.map((${item}) => html`, "`") + inner + tok("tpl", "`)}"),
  when: (e, negate, inner) => wrap("${", `${negate ? "!" : ""}${e} ? html`, "`") + inner + tok("tpl", '` : ""}'),
  include: (name) => wrap("${", `${camel(name)}(project)`, "}"),
};

const typescript: InlineDialect = { ...templateLiteral, label: "TypeScript", short: "TS" };

const django: InlineDialect = {
  kind: "inline",
  label: "Django template",
  short: "Django",
  expr: dotted,
  text: (e) => wrap("{{ ", e, " }}"),
  raw: (e) => wrap("{{ ", `${e}|safe`, " }}"),
  join: (e) => wrap("{{ ", `${e}|join:", "`, " }}"),
  attr: (name, e) => quotedAttr(name, wrap("{{ ", e, " }}")),
  each: (list, item, inner) => wrap("{% for ", `${item} in ${list}`, " %}") + inner + tok("tpl", "{% endfor %}"),
  when: (e, negate, inner) => wrap("{% if ", negate ? `not ${e}` : e, " %}") + inner + tok("tpl", "{% endif %}"),
  include: (name) => wrap("{% include ", `"partials/${name.replace(/-/g, "_")}.html"`, " %}"),
};

const jinja: InlineDialect = {
  ...django,
  label: "Jinja2",
  short: "Jinja2",
  raw: (e) => wrap("{{ ", `${e} | safe`, " }}"),
  join: (e) => wrap("{{ ", `${e} | join(", ")`, " }}"),
};

const th = (name: string, value: string) => quotedAttr(`th:${name}`, wrap("${", value, "}"));

const thymeleaf: AttributeDialect = {
  kind: "attribute",
  label: "Thymeleaf",
  short: "Thymeleaf",
  expr: dotted,
  text: (e) => th("text", e),
  raw: (e) => th("utext", e),
  join: (e) => th("text", `#strings.listJoin(${e}, ', ')`),
  attr: (name, e) => th(name, e),
  each: (list, item) => quotedAttr("th:each", tok("var", `${item} : `) + wrap("${", list, "}")),
  when: (e, negate) => th(negate ? "unless" : "if", e),
  include: (name) =>
    tok("punc", "<") + tok("tag", "div") + quotedAttr("th:replace", wrap("~{", `fragments/${name}`, "}")) + tok("punc", "></") + tok("tag", "div") + tok("punc", ">"),
};

const cobol: CobolDialect = { kind: "cobol", label: "COBOL screen section", short: "COBOL" };

export const DIALECTS: Record<string, Dialect> = { blade, php, jsx, js: templateLiteral, ts: typescript, django, jinja, thymeleaf, cobol };

/** Dialetto da mostrare per un progetto: prima il framework, poi il linguaggio */
export function dialectFor(language: string, frameworks: string[]): string {
  const byFramework: Record<string, string> = {
    Laravel: "blade",
    React: "jsx",
    Django: "django",
    FastAPI: "jinja",
    "Spring Boot": "thymeleaf",
  };
  const byLanguage: Record<string, string> = { php: "php", js: "js", ts: "ts", python: "jinja", java: "thymeleaf", cobol: "cobol" };
  for (const framework of frameworks) {
    if (byFramework[framework]) return byFramework[framework];
  }
  return byLanguage[language] ?? "";
}
