---
title: Portfolio
summary: The site you're looking at, a phosphor terminal with a lens that shows the code beneath the page.
---

The site you're looking at. A static site built with **Astro** that recalls an old phosphor terminal: monospaced text, glowing characters and two colours to choose from, **amber** or **green**.

## What it does

- **3270 terminal navigation**: function keys open the sections, `F1` stack, `F2` projects, `F3` contact, and `F4` switches to the other language
- **Stack ordered by experience**: languages with their frameworks and project count, plus the AI tools I use every day
- **Projects grouped by language**: keyboard-accessible tabs, with the address following the open tab (`#progetti/python`) so a link takes you straight to the right group
- **Multi-language projects**: a Laravel + React project appears only once under "All", in its main language, and in both single-language tabs
- **Framework filters** within each language, when its projects use more than one
- **Inspect code mode**: the lens button (or the `I` key) turns the cursor into a lens that shows the HTML markup beneath the page, with the component's source file; `+` and `−` resize it, `Esc` exits
- **The lens speaks the project's language**: on project pages the same markup becomes a Blade, JSX, Django, Jinja2, Thymeleaf, PHP, JavaScript or TypeScript template, or a COBOL SCREEN SECTION, with the data in place of variables. The code under the lens glows in the phosphor opposite to the page's
- **Complete project pages**: screenshots or a demo video (with the cover as its poster), a details sheet with languages, frameworks and technologies, and links to the previous and next project
- **Generated previews**: if a project has no screenshots, an editor window appears with code in its language
- **Italian and English**, with a language switcher that keeps you on the same page and the same tab
- **Amber or green phosphor**, remembered between visits and applied before rendering, with no flash

## How it's built

- **Astro** with fully static output: no server, it can be published on any host
- **Content Collections** for the projects: a folder with a Markdown file (plus its English translation) and the screenshots, validated with a **Zod** schema that stops the build if a field is missing or a language doesn't exist
- Images optimised at build time and code blocks highlighted with **Shiki**
- **TypeScript** for the lens: it serialises the visible DOM and translates it into the various template dialects thanks to the `data-bind`, `data-each` and `data-if` attributes; the dialect is picked from the project's framework or, failing that, its language
- **SEO and sharing**: canonical URLs, `hreflang` for both languages, Open Graph images generated from the cover and a favicon drawn from the initials
- **CSS** without frameworks, with variables for the two themes, respecting `prefers-reduced-motion`

> The code shown by the lens on project pages is illustrative, not the actual source.
