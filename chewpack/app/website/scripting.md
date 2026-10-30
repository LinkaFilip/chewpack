# Scripting in ChewPack

ChewPack has Python built in. A script is a short program that changes your font for you. Use one when a job would take an afternoon of clicking: set the side bearings of 80 glyphs, rename a whole set, build every accented letter, or list all glyphs that are still empty.

You don't need to install anything. ChewPack comes with Python 3.13. You also don't need to be a programmer: most useful scripts are 3 to 10 lines long, and the recipes below can be copied as they are.

---

## Contents

1. [Your first script](#your-first-script)
2. [The Scripting window](#the-scripting-window)
3. [Saving scripts and running them from the menu](#saving-scripts-and-running-them-from-the-menu)
4. [Undo, errors and stopping a script](#undo-errors-and-stopping-a-script)
5. [How ChewPack sees your font](#how-chewpack-sees-your-font)
6. [Recipes](#recipes)
7. [API reference](#api-reference)
8. [Coming from RoboFont, FontLab or Glyphs](#coming-from-robofont-fontlab-or-glyphs)
9. [Limits](#limits)
10. [Safety: only run scripts you trust](#safety-only-run-scripts-you-trust)
11. [A five-minute Python primer](#a-five-minute-python-primer)

---

## Your first script

1. Open a font.
2. Choose **Scripts › Scripting window…** or press **Ctrl+Shift+P**.
3. Replace the text in the editor with:

   ```python
   font = CurrentFont()
   for glyph in font:
       print(glyph.name, glyph.width)
   ```

4. Press **Ctrl+Enter** (or **F5**, or click **Run**).

The output pane under the editor lists every glyph with its advance width. That script only reads the font, so nothing changed.

Now try one that changes it. Select a few glyphs in the glyph grid, then run:

```python
for glyph in CurrentFont().selectedGlyphs:
    glyph.leftMargin = 40
    glyph.rightMargin = 40
```

The selected glyphs now have 40 units on each side. Press **Ctrl+Z** in the main window and they're back as they were. Everything a script does undoes in one step.

---

## The Scripting window

| Part | What it does |
| --- | --- |
| **Scripts** list (left) | Your saved scripts. Click one to open it. **New** starts an empty script; **Folder** opens the folder they're saved in. |
| Editor (top right) | Where you write the script. **Tab** inserts four spaces. **Enter** keeps the indentation, and adds a level after a line ending in `:`. |
| Output (bottom right) | What the script prints, and any error. When you open the window, it shows a short summary of the API. |
| Status line | How long the run took, or what went wrong. |

| Key | Action |
| --- | --- |
| **Ctrl+Shift+P** | Open the Scripting window (from the main window) |
| **Ctrl+Enter** or **F5** | Run the script |
| **Ctrl+S** | Save the script |

While a script runs, the main window is locked, so you can't edit the font at the same time as the script. A dot (•) after the script's name means it has changes that aren't saved. If you close the window with changes that aren't saved, they're kept as a draft until you reopen it.

---

## Saving scripts and running them from the menu

Click **Save** (Ctrl+S) and give the script a name. Scripts are saved as ordinary `.py` files in:

```
%APPDATA%\ChewPack\Scripts
```

**Scripts › Open scripts folder** takes you there. You can also copy `.py` files into that folder yourself, for example scripts a friend sent you. Read them first; see [Safety](#safety-only-run-scripts-you-trust).

Every saved script appears in the **Scripts** menu and runs from there in one click. You don't need the Scripting window for that.

When a script runs from the menu:

- If it **prints nothing** and works, a small notification says "Ran *name*" with an **Undo** button.
- If it **prints something** or **fails**, the Scripting window opens so you can read the output.

So a script you use often, like "Tidy spacing" or "Build accents", is best kept quiet: only print when something needs your attention.

---

## Undo, errors and stopping a script

**One run, one undo.** Whatever a script changes (outlines, metrics, names, kerning, features, font info), **Ctrl+Z** in the main window takes the whole run back in one step.

**When a script fails**, the output shows a Python error message ("traceback") that points at the line in *your* script, and ChewPack selects that line in the editor. The last line of the traceback usually says what was wrong, e.g. `KeyError: 'Aacute'`, meaning there is no glyph with that name.

> Changes made *before* the error are kept. Press Ctrl+Z if you want them gone too.

**To stop a script** that runs too long (say, a loop that never ends), click **Stop**. The script ends at its next step, keeps what it changed up to then, and Ctrl+Z undoes it. You can't close the Scripting window while a script is running; stop it first.

Only one script runs at a time.

---

## How ChewPack sees your font

This is the part to understand once; then every recipe makes sense.

### Font units, y up

Scripts work in **font units**, the same numbers that end up in the exported font:

- **y = 0 is the baseline** and y goes **up**. The x-height might be at y = 500, the descender at y = −200.
- **x = 0 is the glyph's left edge**, where its advance starts. The advance ends at x = `glyph.width`.

So a point at `(100, 500)` sits 100 units from the glyph's left edge, at x-height (if your x-height is 500).

### Side bearings move the edge, not the outline

Setting `glyph.leftMargin = 50` changes the white space on the left, and the advance width grows or shrinks to match. The drawing itself doesn't move on screen; the glyph's edges do. This is the same as typing the number into the Inspector.

`glyph.width = 600` keeps the left side bearing and gives the difference to the right one.

### Contours and points

A glyph is made of **contours** (closed shapes, or open paths), and each contour is a list of **points**. Every point has a `type`:

| `type` | Meaning |
| --- | --- |
| `"line"` | An on-curve point reached by a straight line. |
| `"curve"` | An on-curve point reached by a curve. The two points just before it are its handles. |
| `"offcurve"` | A handle (off-curve control point). |
| `"qcurve"` | An on-curve point reached by a quadratic (TrueType-style) curve. ChewPack converts it to a normal curve when it's written back. |
| `"move"` | The first point of an open contour. |

`point.smooth` is `True` for a smooth point (handles in line), `False` for a corner.

### Which way contours run

Fill depends on the direction a contour runs:

- **Outer shapes run counter-clockwise.**
- **Holes (counters, like the inside of o) run clockwise.**

This matches UFO and FontParts. If you draw shapes with a script and the holes come out filled, call `glyph.correctDirection()`; it fixes every contour by how deeply it's nested.

### When changes reach the font

Metrics, names, components, anchors, kerning and font info change **immediately**. Outline changes (moving points, adding contours) are collected and written when the script ends, so a script that moves thousands of points stays fast. If you need the new outline mid-script, for example to read `glyph.bounds` after moving points, call `glyph.changed()`. Reading `bounds`, `leftMargin` or `rightMargin` already does this for you.

### Which master

With several masters (Font Info › Masters), a script works on **the master you're editing**. To change another master, switch to it and run the script again.

---

## Recipes

Copy, paste, adjust the numbers at the top, run. Each recipe is one undo step.

### List the glyphs that are still empty

```python
font = CurrentFont()
empty = [g.name for g in font if g.bounds is None and not g.components]
print(len(empty), "empty glyphs:")
print(" ".join(empty))
```

### Same side bearings for the selection

```python
LEFT = 40
RIGHT = 40

for glyph in CurrentFont().selectedGlyphs:
    glyph.leftMargin = LEFT
    glyph.rightMargin = RIGHT
```

### Loosen or tighten everything a little

```python
CHANGE = 5   # units per side; use a negative number to tighten

for glyph in CurrentFont():
    if glyph.bounds is None:      # skip empty glyphs and the space
        continue
    glyph.leftMargin += CHANGE
    glyph.rightMargin += CHANGE
```

### Copy spacing from one letter to similar ones

```python
font = CurrentFont()
n = font["n"]
for name in ["m", "h", "r", "p"]:
    font[name].leftMargin = n.leftMargin
```

This copies once. To keep them linked, so they follow n whenever n changes, type `=n` into the LSB field in the Inspector instead.

### Round every point to whole units

```python
for glyph in CurrentFont():
    glyph.round()
```

### Fix contour directions in the whole font

```python
for glyph in CurrentFont():
    glyph.correctDirection()
```

### Build accented letters from components

The base letter needs a `top` anchor and the accent a `_top` anchor (the usual convention). The script places the accent so the two anchors meet.

```python
font = CurrentFont()

ACCENTS = [
    # (new glyph, Unicode, base, accent)
    ("Aacute", 0x00C1, "A", "acutecomb"),
    ("aacute", 0x00E1, "a", "acutecomb"),
    ("Eacute", 0x00C9, "E", "acutecomb"),
    ("eacute", 0x00E9, "e", "acutecomb"),
]

def anchor(glyph, name):
    for a in glyph.anchors:
        if a.name == name:
            return a.position
    return None

for name, code, base_name, accent_name in ACCENTS:
    if name in font and (font[name].bounds is not None or font[name].components):
        print("skipped", name, "- it already has a drawing")
        continue
    if base_name not in font or accent_name not in font:
        print("skipped", name, "- missing", base_name, "or", accent_name)
        continue
    base, accent = font[base_name], font[accent_name]
    top, mark = anchor(base, "top"), anchor(accent, "_top")
    if top is None or mark is None:
        print("skipped", name, "- needs a 'top' anchor on", base_name, "and '_top' on", accent_name)
        continue

    glyph = font.newGlyph(name, unicode=code)
    glyph.appendComponent(base_name)
    glyph.appendComponent(accent_name, (top[0] - mark[0], top[1] - mark[1]))
    glyph.width = base.width
```

The check at the start of the loop matters: `font.newGlyph(name)` **clears** a glyph that already exists. See [Limits](#limits).

### Add a `top` anchor to every lowercase letter

```python
font = CurrentFont()
X_HEIGHT = font.info.xHeight

for glyph in font:
    if glyph.unicode is None or not chr(glyph.unicode).islower():
        continue
    if any(a.name == "top" for a in glyph.anchors) or glyph.bounds is None:
        continue
    xMin, yMin, xMax, yMax = glyph.bounds
    glyph.appendAnchor("top", ((xMin + xMax) / 2, max(yMax, X_HEIGHT)))
```

### Draw a shape with a pen

```python
glyph = CurrentGlyph()          # the glyph open in the editor
pen = glyph.getPen()

# a 100 × 100 square sitting on the baseline, counter-clockwise (filled)
pen.moveTo((50, 0))
pen.lineTo((150, 0))
pen.lineTo((150, 100))
pen.lineTo((50, 100))
pen.closePath()

# a curve: two handles, then the point
pen.moveTo((200, 0))
pen.lineTo((300, 0))
pen.curveTo((300, 80), (260, 120), (200, 120))
pen.closePath()
```

### Kerning pairs and groups

```python
font = CurrentFont()

# groups: glyphs that kern alike
font.groups["public.kern1.O"] = ("O", "D", "Q")   # their RIGHT side, when they come first
font.groups["public.kern2.O"] = ("O", "C", "G", "Q")   # their LEFT side, when they come second

# pairs between glyphs, groups, or both
font.kerning[("T", "o")] = -60
font.kerning[("public.kern1.O", "V")] = -30

# what T + o actually gets, with groups and exceptions worked out
print(font.kerning.find(("T", "o")))
```

### Take a pair out of kerning

```python
font = CurrentFont()
pair = ("T", "o")
if pair in font.kerning:
    del font.kerning[pair]
```

### Rename a set of glyphs

```python
font = CurrentFont()
for glyph in font:
    if glyph.name.endswith(".alt"):
        glyph.name = glyph.name[:-4] + ".ss01"
```

### Add OpenType feature code and check that it compiles

```python
features = CurrentFont().features
features.text += """
feature liga {
    sub f i by f_i;
} liga;
"""
errors = features.compile()
print("\n".join(errors) if errors else "Features compile.")
```

`features.automatic` turns on features made from glyph names (`a.sc` → small caps, `f_i` → ligature, `g.ss01` → stylistic set). `features.automaticText` shows the code they produce.

### Save a spacing table as CSV

```python
import csv, os

path = os.path.expanduser("~/Desktop/spacing.csv")
with open(path, "w", newline="", encoding="utf-8") as f:
    out = csv.writer(f)
    out.writerow(["glyph", "width", "left", "right"])
    for g in CurrentFont():
        out.writerow([g.name, g.width, g.leftMargin, g.rightMargin])
print("Saved", path)
```

---

## API reference

Each script starts with these already available: `CurrentFont`, `CurrentGlyph`, `AllFonts`, and the classes `Font`, `Glyph`, `Contour`, `Point`, `Component`, `Anchor`, `Kerning`, `Groups`, `Features`, `Info`. You don't need an `import`.

### Getting started

| | |
| --- | --- |
| `CurrentFont()` | The open font. |
| `CurrentGlyph()` | The glyph in the active editor tab, or `None`. |
| `AllFonts()` | A list with the open font (ChewPack has one font open at a time). |

### Font

| | |
| --- | --- |
| `font["a"]` | The glyph named `a`. Raises `KeyError` if there is none. |
| `font.get("a")` | The same, but `None` if there is none. |
| `"a" in font` | Whether the glyph exists. |
| `for glyph in font` | Every glyph: characters in Unicode order, then unencoded glyphs (`a.sc`, `f_i`) by name. |
| `len(font)` | Number of glyphs. |
| `font.keys()`, `font.glyphOrder` | All glyph names, in that order. |
| `font.newGlyph(name, clear=True, unicode=None)` | Makes a glyph and returns it. **If one with that name (or that Unicode value) exists, it is cleared** unless you pass `clear=False`. A new glyph is half an em wide. |
| `font.removeGlyph(name)` / `del font[name]` | Deletes a glyph. Glyphs that used it as a component get its outline instead, and its kerning pairs are removed. |
| `font.selectedGlyphs` | The glyphs selected in the glyph grid. |
| `font.selectedGlyphNames` | Their names. |
| `font.info` | Font info (below). |
| `font.kerning` | Kerning pairs (below). |
| `font.groups` | Kerning groups (below). |
| `font.features` | OpenType feature code (below). |

### Info

Read or set: `font.info.familyName`, `styleName`, `unitsPerEm`, `ascender`, `descender`, `xHeight`, `capHeight`, `openTypeHheaLineGap`, `openTypeOS2WeightClass` (1–1000), `openTypeOS2WidthClass` (1–9).

Other Font Info fields (designer, licence, vertical metrics beyond these…) aren't available to scripts yet.

### Glyph

**Identity**

| | |
| --- | --- |
| `glyph.name` | Glyph name; set it to rename. It must be a valid glyph name and not taken. |
| `glyph.unicode` | Unicode value as a number (`0x41` for A), or `None`. Setting it moves the glyph to that character; components and kerning follow. `None` makes it unencoded. |
| `glyph.unicodes` | The same as a tuple (ChewPack keeps one Unicode value per glyph). |
| `glyph.openTypeCategory` | `"base"`, `"ligature"`, `"mark"`, `"component"`, or `None` when ChewPack works it out from the character and name. |

**Metrics**

| | |
| --- | --- |
| `glyph.width` | Advance width. Setting it keeps the left side bearing. |
| `glyph.leftMargin`, `glyph.rightMargin` | Side bearings. `None` for a glyph without its own outlines. |
| `glyph.bounds` | `(xMin, yMin, xMax, yMax)` of the glyph's own outlines, or `None`. |

**Outlines**

| | |
| --- | --- |
| `glyph.contours`, `glyph[0]`, `for contour in glyph`, `len(glyph)` | The contours. |
| `glyph.appendContour(contour, offset=(0, 0))` | Copies a contour (from any glyph) into this one. |
| `glyph.removeContour(contour or index)` | Removes one. |
| `glyph.clearContours()` | Removes all contours. |
| `glyph.clear()` | Removes contours, components and anchors. |
| `glyph.getPen()` | A pen that draws new contours: `moveTo`, `lineTo`, `curveTo`, `qCurveTo`, `closePath`, `endPath`, `addComponent`. |
| `glyph.draw(pen)` | Draws the glyph's contours into any segment pen. |
| `glyph.move((dx, dy))`, `glyph.moveBy(…)` | Moves contours, components and anchors. |
| `glyph.scaleBy(factor, origin=None)` | Scales contours and anchors; `factor` is a number or `(sx, sy)`. |
| `glyph.round()` | Rounds every point to whole units. |
| `glyph.correctDirection()` | Outer contours counter-clockwise, holes clockwise. |
| `glyph.changed()` | Writes outline changes now instead of at the end of the script. |

**Components and anchors**

| | |
| --- | --- |
| `glyph.components` | Tuple of components: `baseGlyph` (name), `offset`, `scale`. Set `component.offset`/`scale` or call `component.moveBy((dx, dy))`. |
| `glyph.appendComponent(name, offset=(0, 0), scale=(1, 1))` | Adds a component. A glyph can't contain itself. |
| `glyph.removeComponent(component or index)`, `glyph.clearComponents()` | |
| `glyph.decompose()` | Replaces components with copies of their outlines. |
| `glyph.anchors` | Tuple of anchors: `name`, `x`, `y`, `position`, each can be set. |
| `glyph.appendAnchor(name, (x, y))`, `glyph.removeAnchor(anchor or index)`, `glyph.clearAnchors()` | |

**Kerning groups**

| | |
| --- | --- |
| `glyph.leftKerningGroup` | Group of the glyph's left side (used when it comes second in a pair). |
| `glyph.rightKerningGroup` | Group of its right side (used when it comes first). |

### Contour

| | |
| --- | --- |
| `contour.points`, `contour[i]`, `for point in contour` | The points. |
| `contour.onCurvePoints` | Points that aren't handles. |
| `contour.open` | `True` for an open path. |
| `contour.clockwise` | Direction; set it to turn the contour round. |
| `contour.reverse()` | Turns the contour round (a filled shape becomes a hole and back). |
| `contour.appendPoint((x, y), type="line", smooth=False)`, `insertPoint(i, …)`, `removePoint(point or index)` | |
| `contour.move((dx, dy))`, `contour.bounds` | |
| `contour.draw(pen)` | |

### Point

`point.x`, `point.y`, `point.position`, `point.type`, `point.smooth`, `point.move((dx, dy))`. All can be set.

### Kerning

`font.kerning` works like a Python dictionary from `(first, second)` to a value.

- A side is a glyph name or a group. Groups are written the UFO way: **`public.kern1.NAME` on the first side** and **`public.kern2.NAME` on the second**.
- `font.kerning[("T", "o")] = -60`, `del font.kerning[pair]`, `for pair in font.kerning`, `font.kerning.items()`, `len(font.kerning)`, `font.kerning.clear()`.
- `font.kerning.find(("T", "o"))` is the value two glyphs actually get, with groups and exceptions worked out (0 if none).

### Groups

`font.groups` holds **kerning groups only**. Group names start with `public.kern1.` (the right side of the glyphs in it, when they come first) or `public.kern2.` (their left side, when they come second).

- `font.groups["public.kern1.O"]` is a tuple of glyph names.
- Setting it puts exactly those glyphs in the group (glyphs not listed leave it); `del` empties it.
- This is the same thing as setting `glyph.rightKerningGroup = "O"` (kern1) or `glyph.leftKerningGroup = "O"` (kern2) on each glyph.

### Features

| | |
| --- | --- |
| `font.features.text` | Your feature code (the AFDKO `.fea` language), as in Font › Features. |
| `font.features.automatic` | Whether features are also made from glyph names. |
| `font.features.automaticText` | The code those automatic features make. |
| `font.features.compile()` | A list of errors; empty when the code compiles. |

---

## Coming from RoboFont, FontLab or Glyphs

ChewPack's API is modelled on **FontParts**, the API of RoboFont and FontLab, so many short scripts work as they are or with small changes:

- `CurrentFont()`, `CurrentGlyph()`, `font["a"]`, `glyph.leftMargin`, `glyph.contours`, `glyph.getPen()`, `font.kerning`, `font.groups` work as you'd expect.
- Points have UFO types (`"line"`, `"curve"`, `"qcurve"`, `"offcurve"`, `"move"`) and outer contours run counter-clockwise, as in UFO.
- Kerning groups use `public.kern1.` / `public.kern2.` names, as in UFO 3.

Not there (yet): layers, guidelines, glyph marks/colours, `glyph.lib` / `font.lib`, images, `transformBy` / `rotateBy` / `skewBy`, `font.save()`, opening or creating other fonts, and the `fontTools` / `fontParts` packages themselves. Glyphs.app scripts (`Glyphs.font`, `GSGlyph` …) use a different API and won't run without rewriting.

---

## Limits

Read this before writing a script that does something large.

- **`font.newGlyph()` clears an existing glyph.** If a glyph with that name or Unicode value already exists, its contours, components and anchors are removed. Pass `clear=False`, or check `if name in font` first. (Undo still brings it back.)
- **One font, one master.** Scripts see the open font, and only the master you're editing. Changing points in one master but not the others can break interpolation; Font Info › Masters will tell you.
- **Components:** offset and scale only, no rotation or slant.
- **Glyphs made only of components** have no `bounds`, `leftMargin` or `rightMargin` of their own (they're `None`). Set `glyph.width` instead, or `decompose()` first.
- **Quadratic curves** (`"qcurve"`) are converted to cubic curves when written back.
- **One Unicode value per glyph.**
- **Linked side bearings** (`=n` in the Inspector) can't be set from a script. A script that sets a linked side gives it a number; ChewPack then re-applies the link when the script ends, so the linked value wins.
- **Python packages:** you get Python's standard library (`math`, `re`, `json`, `csv`, `random`, `os`…). There is no `pip`, so packages such as `fontTools` aren't available.
- **No input while running:** a script can't ask you questions (`input()` doesn't work). Put the settings as variables at the top of the script, as the recipes do.
- **The font is locked while a script runs.** You can't edit by hand at the same time; **Stop** ends a script early.

---

## Safety: only run scripts you trust

A script is a real Python program. Besides changing your font, it can read and write files on your computer, just like any program you run. That's what makes the CSV recipe above possible, but it also means a script from a stranger could do harm.

- Only run scripts from people you trust, or scripts you've read and understood.
- Be careful with scripts that use `os`, `shutil`, `subprocess`, `urllib` or `open(…, "w")` when you don't know why they need them.
- Save your font before running a script that changes a lot. Undo covers the font, but not files a script writes elsewhere.

---

## A five-minute Python primer

Enough Python to read and adjust every recipe on this page.

**Variables** hold a value:

```python
LEFT = 40
name = "n"
```

**`print`** shows something in the output pane:

```python
print("The n is", CurrentFont()["n"].width, "units wide")
```

**Loops** repeat the indented lines for each item:

```python
for glyph in CurrentFont():
    print(glyph.name)      # these 4 spaces of indentation matter
```

**Conditions** run lines only when something is true:

```python
if glyph.width > 600:
    print(glyph.name, "is wide")
elif glyph.width == 0:
    print(glyph.name, "has no width")
else:
    pass                   # do nothing
```

**`continue`** skips to the next item in a loop; **`break`** leaves the loop.

**Lists** and **tuples** hold several values: `["m", "n", "h"]`, `(100, 200)`. A point position is a tuple `(x, y)`.

**Comparisons:** `==` equal, `!=` not equal, `<`, `>`, `<=`, `>=`, `in` (`"a" in font`), `is None`.

**Shortcuts:** `x += 5` means `x = x + 5`.

**Unicode values** are written in hex with `0x`: `0x00E9` is é. `chr(0x00E9)` gives `"é"`, `ord("é")` gives `233`.

**Comments** start with `#` and are ignored. Use them to note what your script does.

When something goes wrong, read the **last line** of the error first: it names the problem. The line above it shows where in your script it happened.
