/*
 * Codice evidenziato "finto": il profilo JSON nell'intestazione e le anteprime
 * in stile editor mostrate quando un progetto non ha screenshot.
 */

type Token = string | [cls: string, text: string];
type Line = Token[] | false;

const T = (cls: string, text: string): Token => [cls, text];

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPES[c]);

function renderCode(lines: Line[]): string {
  return lines
    .filter((line): line is Token[] => line !== false)
    .map((line) =>
      line.map((tok) => (typeof tok === "string" ? esc(tok) : `<span class="t-${tok[0]}">${esc(tok[1])}</span>`)).join(""),
    )
    .join("\n");
}

// ---- Profilo --------------------------------------------------

function jsonArray(key: string, items: string[]): Line[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let width = 0;
  for (const item of items) {
    if (current.length && width + item.length + 4 > 34) {
      rows.push(current);
      current = [];
      width = 0;
    }
    current.push(item);
    width += item.length + 4;
  }
  if (current.length) rows.push(current);

  const lines: Line[] = [["  ", T("key", `"${key}"`), T("punc", ": [")]];
  rows.forEach((row, i) => {
    const line: Token[] = ["    "];
    row.forEach((item, j) => {
      line.push(T("str", `"${item}"`));
      const isLast = i === rows.length - 1 && j === row.length - 1;
      if (!isLast) line.push(T("punc", j === row.length - 1 ? "," : ", "));
    });
    lines.push(line);
  });
  lines.push(["  ", T("punc", "],")]);
  return lines;
}

export interface Profile {
  role?: string;
  location?: string;
  languages: string[];
  frameworks: string[];
  ai?: string[];
  projects: number;
}

/** Nome del file e chiavi del JSON, nella lingua della pagina */
export interface ProfileLabels {
  file: string;
  role: string;
  location: string;
  languages: string;
  projects: string;
}

export function profileCode(profile: Profile, labels: ProfileLabels): string {
  const pair = (key: string, value?: string): Line =>
    value ? ["  ", T("key", `"${key}"`), T("punc", ": "), T("str", `"${value}"`), T("punc", ",")] : false;

  return renderCode([
    [T("prompt", "$ "), `cat ${labels.file}`],
    [T("punc", "{")],
    pair(labels.role, profile.role),
    pair(labels.location, profile.location),
    ...jsonArray(labels.languages, profile.languages),
    ...(profile.frameworks.length ? jsonArray("framework", profile.frameworks) : []),
    ...(profile.ai?.length ? jsonArray("ai", profile.ai) : []),
    ["  ", T("key", `"${labels.projects}"`), T("punc", ": "), T("num", String(profile.projects))],
    [T("punc", "}")],
  ]);
}

// ---- Anteprima progetto ------------------------------------------

const words = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").split(/[^A-Za-z0-9]+/).filter(Boolean);
const pascal = (s: string) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("") || "Progetto";
const snake = (s: string) => words(s).map((w) => w.toLowerCase()).join("_") || "progetto";

export interface SnippetProject {
  id: string;
  title: string;
  language: string;
  ext: string;
  frameworks: string[];
  tags: string[];
}

export function projectSnippet(p: SnippetProject): { file: string; html: string } {
  const name = pascal(p.title);
  const stack = [...p.frameworks, ...p.tags].join(", ");
  const uses = (fw: string) => p.frameworks.includes(fw);

  switch (p.language) {
    case "php":
      return {
        file: `${name}.php`,
        html: renderCode([
          [T("kw", "<?php")],
          [],
          [T("com", "/**")],
          [T("com", ` * ${p.title}`)],
          stack ? [T("com", ` * @stack ${stack}`)] : false,
          [T("com", " */")],
          [T("kw", "final class "), T("name", name)],
          [T("punc", "{")],
          ["    ", T("kw", "public function "), T("name", "__invoke"), T("punc", "(): void {}")],
          [T("punc", "}")],
        ]),
      };

    case "js":
      return {
        file: `${name}.${uses("React") ? "jsx" : "js"}`,
        html: renderCode([
          [T("com", "/**")],
          [T("com", ` * ${p.title}`)],
          stack ? [T("com", ` * @stack ${stack}`)] : false,
          [T("com", " */")],
          [T("kw", "export default function "), T("name", name), T("punc", "() {")],
          uses("React")
            ? ["  ", T("kw", "return "), T("punc", "<"), T("name", "App"), T("punc", " />;")]
            : ["  ", T("kw", "return null"), T("punc", ";")],
          [T("punc", "}")],
        ]),
      };

    case "ts":
      return {
        file: `${name}.${uses("React") ? "tsx" : "ts"}`,
        html: renderCode([
          [T("com", "/**")],
          [T("com", ` * ${p.title}`)],
          stack ? [T("com", ` * @stack ${stack}`)] : false,
          [T("com", " */")],
          [T("kw", "export default function "), T("name", name), T("punc", "(): "), T("name", uses("React") ? "JSX.Element" : "void"), T("punc", " {")],
          uses("React")
            ? ["  ", T("kw", "return "), T("punc", "<"), T("name", "App"), T("punc", " />;")]
            : false,
          [T("punc", "}")],
        ]),
      };

    case "python": {
      const body: Line[] = uses("FastAPI")
        ? [
            [T("kw", "from "), "fastapi ", T("kw", "import "), T("name", "FastAPI")],
            [],
            ["app ", T("punc", "= "), T("name", "FastAPI"), T("punc", "("), "title", T("punc", "="), T("str", `"${p.title}"`), T("punc", ")")],
          ]
        : uses("Django")
          ? [
              [T("kw", "from "), "django.db ", T("kw", "import "), "models"],
              [],
              [T("kw", "class "), T("name", name), T("punc", "(models.Model):")],
              ["    ", T("kw", "pass")],
            ]
          : [
              [T("kw", "def "), T("name", "main"), T("punc", "():")],
              ["    ", T("kw", "pass")],
            ];
      return {
        file: `${snake(p.title)}.py`,
        html: renderCode([
          [T("str", '"""')],
          [T("str", p.title)],
          stack ? [T("str", `Stack: ${stack}`)] : false,
          [T("str", '"""')],
          [],
          ...body,
        ]),
      };
    }

    case "cobol": {
      const id = words(p.id).join("-").toUpperCase().slice(0, 30) || "PROGRAMMA";
      return {
        file: `${id}.cbl`,
        html: renderCode([
          ["       ", T("kw", "IDENTIFICATION DIVISION.")],
          ["       ", T("kw", "PROGRAM-ID. "), T("name", id), T("punc", ".")],
          ["      ", T("com", `* ${p.title}`)],
          stack ? ["      ", T("com", `* ${stack}`)] : false,
          ["       ", T("kw", "PROCEDURE DIVISION.")],
          ["           ", T("kw", "STOP RUN.")],
        ]),
      };
    }

    case "java":
      return {
        file: `${name}.java`,
        html: renderCode([
          [T("com", "/**")],
          [T("com", ` * ${p.title}`)],
          stack ? [T("com", ` * ${stack}`)] : false,
          [T("com", " */")],
          uses("Spring Boot") ? [T("name", "@SpringBootApplication")] : false,
          [T("kw", "public class "), T("name", name), T("punc", " {")],
          ["    ", T("kw", "public static void "), T("name", "main"), T("punc", "(String[] args) {}")],
          [T("punc", "}")],
        ]),
      };

    default:
      return {
        file: `${p.id}${p.ext}`,
        html: renderCode([[T("com", `// ${p.title}`)], stack ? [T("com", `// ${stack}`)] : false]),
      };
  }
}
