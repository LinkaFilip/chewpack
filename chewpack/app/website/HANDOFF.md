# Brief: build the ChewPack docs section on chewpack.app

You're working on the website for **ChewPack**, a free font editor for Windows. The site is React + TypeScript and already lets people download the app. Your job is to add a **documentation section** (tutorials, feature reference, keyboard shortcuts) built entirely from the content files that come with this brief. The content was written from the app's source code; you don't need the app's code and shouldn't invent anything about the app.

## The files you get

| File | What it is |
| --- | --- |
| `chewpack-docs.json` | All content: categories, features, keyboard shortcuts, step-by-step guides. |
| `scripting.md` | A long-form guide to Python scripting in ChewPack, referenced from the JSON as a "document". |
| `HANDOFF.md` | This brief. Don't publish it. |

Copy `chewpack-docs.json` and `scripting.md` into the site's source (e.g. `src/content/docs/`) and import them at build time. Don't fetch them at runtime and don't rewrite them by hand: they will be replaced by newer versions as the app changes, so **all pages must be generated from the files**, with no copy duplicated in components.

## First, look at the existing site

Before writing anything, read the site's code: router, layout, header/nav, styling approach (CSS modules, Tailwind, styled-components…), existing components, and whether a Markdown renderer is already installed. The docs must look like part of the same site: same header, footer, fonts, colours, spacing and components. Reuse what exists. Don't add a second styling system.

## Pages to build

Suggested routes; adapt them to the router the site uses:

| Route | Content |
| --- | --- |
| `/docs` | Docs home: short intro, a search box, the guides as cards ("Start here"), the categories as cards ("Browse by topic"), and a small strip of everyday shortcuts linking to the shortcuts page. |
| `/docs/:featureId` | One page per feature. |
| `/docs/topic/:categoryId` | A category: its title, summary and the list of its features (title + summary, linked). |
| `/docs/shortcuts` | All keyboard shortcuts, grouped, with a filter. |
| `/docs/guides/:guideId` | One step-by-step guide. |
| `/docs/scripting` | The `scripting.md` document rendered as a page (route from `documents[].id`; `/docs/scripting` is a nicer URL for `scripting-guide`). |

A design mockup of these pages exists. The user may share a link to it or screenshots. Treat it as a guide to structure, not to colours or fonts: the site's own style wins.

## The JSON, field by field

```ts
interface DocsData {
  schemaVersion: 1;
  appVersion: string;            // "[x.y.z]" until the user fills it in; show "Documented for ChewPack x.y.z" only when it isn't a placeholder
  generatedFrom: string;         // internal note, don't display
  product: { name: string; tagline: string; platform: string; price: string; website: string; projectFileExtension: string };
  categories: Category[];
  documents: DocumentRef[];
  features: Feature[];
  shortcuts: Shortcut[];
  guides: Guide[];
}

interface Category {
  id: string;          // URL slug
  order: number;       // sort by this
  title: string;
  glyph: string;       // 1–2 characters to show large on the category card (a type specimen, not an icon)
  summary: string;
}

interface DocumentRef {
  id: string;          // "scripting-guide"
  title: string;
  file: string;        // "scripting.md", next to the JSON
  summary: string;
  category: string;    // category id it belongs to
}

interface Feature {
  id: string;          // URL slug. Never change ids; links depend on them
  category: string;    // category id
  title: string;
  summary: string;     // one sentence: page lede, card text, search result text
  where: string[];     // where to find it in the app, as the user sees it ("Font › Auto-space…"); show as chips/list labelled "Where"
  status: "stable" | "beta";   // show a small "Beta" badge for beta; nothing for stable
  body: string;        // Markdown (GitHub-flavoured: tables, lists, inline code)
  shortcuts: string[]; // shortcut ids; show them on the page as key caps with their action
  related: string[];   // feature ids; show as "Related" links at the bottom
  doc?: string;        // document id: show a prominent link to that document
  verify?: string[];   // NOTES FOR THE AUTHOR, NOT FOR USERS. Never render. See below
  media: Media[];      // empty for now
}

interface Media {      // not filled yet; support it so screenshots can be added later without code changes
  type: "image" | "video";
  src: string;         // path or URL
  alt: string;
  caption?: string;
}

interface Shortcut {
  id: string;
  keys: string[];      // each item is one key cap: ["Ctrl", "Shift", "S"]. Some items are gestures: "Arrows", "Hold Space", "Middle-drag", "Wheel", "Click", "Drag", "Double-click"
  action: string;
  context: "global" | "canvas" | "scripting";  // global = anywhere in the app; canvas = in the glyph editor; scripting = in the Scripting window
  group: string;       // heading to group by on the shortcuts page (File, Edit, Glyph, Contour, View, Tools, App, Canvas, Scripting window), in first-appearance order
  menuPath?: string;   // where the command sits in the menus; show it small under the action
  source: "menu" | "code";   // internal: "code" = not in any menu. Don't display
  note?: string;       // optional small note to show
}

interface Guide {
  id: string;
  title: string;
  summary: string;
  specimen: string;    // large text for the guide's card
  minutes: number;     // "about N minutes"
  doc?: string;        // document id, link to it
  steps: GuideStep[];
}

interface GuideStep {
  title: string;
  text: string;        // plain text
  keys: string[];      // key caps for this step (same format as Shortcut.keys); may be empty
  features: string[];  // feature ids; link each as a chip ("Pen →")
  code?: string;       // optional code block (CSS or Python); show monospace with a copy button
}
```

Put these types in the code (e.g. `src/content/docs/types.ts`) and type the imported JSON with them.

## Rules

1. **Don't change the JSON's shape or ids.** If something is missing for a design, ask the user rather than adding fields. If you must add a field, make it optional and tell the user.
2. **Never render `verify`.** Those are notes to the user about facts still to confirm in the app. Optionally list all features that have `verify` in the browser console in development, so the user sees what's left to check.
3. **Never show `source` or `generatedFrom`.**
4. **Markdown:** render `body` and `scripting.md` with one renderer that supports GitHub tables (e.g. `react-markdown` + `remark-gfm` if nothing is installed). Code blocks in `scripting.md` are Python; syntax highlighting is nice but optional. `scripting.md` has a table of contents with `#anchor` links, so headings need matching `id`s (e.g. `rehype-slug`). Inside table cells, `\|` is an escaped pipe and must render as `|`.
5. **Key caps:** render each item of `keys` as a `<kbd>`, joined by a thin space or "+", consistent site-wide. Keys are Windows names (Ctrl, Alt, Shift); don't convert them to Mac symbols.
6. **Shortcuts page:** group by `group`, with filter buttons for the groups (or contexts) and a text filter that matches action, keys and menu path. Mention on the page that the app itself shows all shortcuts with F1 and finds any command with Ctrl+K.
7. **Search** on the docs home: client-side over feature titles, summaries, `where` and shortcut actions is enough. No server.
8. **Empty `media`:** show nothing. Don't add placeholder boxes in production.
9. **Links between content:** `related`, step `features` and `doc` must become real links. If an id doesn't resolve, fail the build or log an error in development; don't render a broken link.
10. **Accessibility:** real `<a>` and `<button>` elements, visible focus, headings in order, `<kbd>` for keys, tables for tabular content. Pages must work at phone width (tables scroll horizontally inside a box).
11. **SEO:** each page gets a `<title>` ("Auto-spacing — ChewPack Docs") and a meta description from `summary`.
12. **Don't invent features, shortcuts or behaviour.** If a page seems to need a fact that isn't in the files, ask the user.

## Done means

- Every category, feature, guide and the scripting document has its page, reachable from `/docs`.
- The shortcuts page lists all 61 shortcuts.
- Replacing `chewpack-docs.json` with a newer version (same schema) updates the site with no code changes.
- No page shows `verify` notes, `source` values or the `[x.y.z]` placeholder.
- The section looks like the rest of chewpack.app.
