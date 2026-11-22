# 2. Installing ZeroHearth and your first run

This chapter covers getting the ZeroHearth plugin into an Obsidian vault, what
happens the first time it loads, and how to use the setup wizard that builds
your first dashboard.

## Installing ZeroHearth

ZeroHearth requires Obsidian **1.8.7** or newer. The plugin can run on desktop
and on Obsidian for iOS and Android.

### From GitHub Releases

Download the three plugin assets (`main.js`, `manifest.json` and `styles.css`)
from a [ZeroHearth release](https://github.com/zero1666/ZeroHearth/releases)
that has them. Place them in `<vault>/.obsidian/plugins/zerohearth/`, reload
the vault, and enable **ZeroHearth** under **Settings → Community plugins**.

### Build from source

Clone `https://github.com/zero1666/ZeroHearth.git` and use Node.js 24:

```sh
npm ci
npm run build
```

Copy `main.js`, `styles.css`, and `manifest.json` into the plugin directory
above. For a beta build, copy `manifest-beta.json` to that directory as
`manifest.json` so Obsidian displays the beta version.

### BRAT

If a ZeroHearth GitHub Release includes the three plugin assets, add
`zero1666/ZeroHearth` in BRAT and choose the release. A Git tag alone
does not provide the assets BRAT needs.

### Moving from Hearth

Export settings from **Settings → Hearth → Backup**. After installing
ZeroHearth, import the backup under **Settings → ZeroHearth → Backup**.
The two plugins have separate settings directories. If you switch your
home page to ZeroHearth, disable Hearth and assign its hotkeys to the
corresponding ZeroHearth commands.

## What happens the first time ZeroHearth loads

On a fresh install ZeroHearth does three things:

1. It registers the **Home** view, a ribbon icon (the ZeroHearth crystal by
   default), and a set of commands including *Open home dashboard*.
2. It sets itself to open on startup and to replace empty new tabs. Both are
   ordinary settings you can turn off — see [chapter 15](15-settings-reference.md).
3. It offers to run the **setup wizard**, which builds your first dashboard
   from a handful of questions.

Vaults that had ZeroHearth installed before the wizard existed are marked as already
set up, so upgrading never offers to rebuild a dashboard you already have.

## Opening ZeroHearth

There are four ways to open the Home view:

- Click the **ZeroHearth crystal** icon in the left ribbon.
- Run the command **Open home dashboard** from the command palette.
- Open a new empty tab, if *Replace new tabs* is on (it is, by default).
- Start Obsidian, if *Open on startup* is on (it is, by default).

You can bind a hotkey to *Open home dashboard*, and to several other ZeroHearth
commands, under **Settings → Hotkeys**. The full list of bindable commands is in
[chapter 15](15-settings-reference.md).

## The setup wizard

The wizard exists so that you are not dropped onto a blank grid. It asks about
you and about your vault, then lays out a board from the answers.

You can run it at any later time from **Settings → ZeroHearth → About → Build a
dashboard**, or with the command **Set up ZeroHearth**.

### The three steps

**Step 1 — What for.** Pick as many purposes as apply. Each one adds cards:

| Purpose | What it adds |
| --- | --- |
| Daily notes & journaling | Today's note front and centre, with a calendar to move between days |
| Tasks & to-dos | A task list, read from your checkboxes or from a task plugin |
| Planning & calendar | A full month/week/day calendar, including any subscribed feeds |
| Finding my notes | What you touched recently, plus a shelf of favourites |
| Quick capture & launching | A card of ready actions: new note, today's note, quick switcher, search, the command palette |
| Vault statistics | How big the vault is and how active you have been |
| Reading & feeds | An RSS card for a site you follow |
| A bit of life | Weather where you are, and a small pet that lives on your board |

The wizard never builds a card that would open empty and waiting to be set up.
So *Reading & feeds* asks for a feed address right under the tiles, and *A bit
of life* for a place; each card joins the board once it has its answer. A place
already set on a weather card elsewhere in the vault, or picked for a *Live
sky* background in step 2, is used without asking again.

Under the purposes, ZeroHearth lists the supported plugins it found installed and
enabled, each with the single thing accepting it will do:

| Plugin found | What ZeroHearth does with it |
| --- | --- |
| TaskNotes | Adds a Tasks card on the TaskNotes source, using TaskNotes' own field names and completed statuses |
| Kanban | Adds a Tasks card showing your board as draggable columns |
| Dataview | Adds a Dataview card, seeded with an editable query |
| Datacore | Adds a Datacore card ready for a query |
| Templater | Adds a launchpad with one button per template you already have |
| Git | Adds a Git card with status, commit and sync |
| Operon | Adds an Operon tasks card (desktop only; Operon still has to approve ZeroHearth separately) |
| Bases | Embeds a `.base` file from your vault |
| Daily notes | Adds a card showing today's daily note, editable in place |
| Bookmarks | Adds a card listing your bookmarks |

The TaskNotes case is worth understanding. TaskNotes lets its users rename its
frontmatter fields and define their own statuses, so there is no fixed set of
names ZeroHearth could assume. The wizard reads the names TaskNotes is actually
configured with — the status field, the due field, the priority field, and which
statuses count as done — and writes them onto the Tasks card it creates. A vault
that renamed `due` to `deadline` therefore gets a Tasks card that works on its
first render. The wizard shows you the values it read before it uses them.

Nothing is installed, enabled or changed in the other plugin. The wizard only
adds a card to the board it is building.

A running count tells you how many cards the board is up to.

**Step 2 — Look.** Chooses the design, a background and a card surface. Every
background and surface is shown as a small painting of itself, so you choose by
looking rather than by reading a description.

The design is *Classic* or *Expressive* (Material 3 Expressive, in tones of your
accent colour), and the wizard redraws itself in the one you pick. On the first
setup it becomes the vault's design — the cards, every ZeroHearth dialog and menu,
the board's buttons and the settings pane — and the design of the drawn
backgrounds with it; running setup again later puts it on the new board only.
You can change it any time in *Settings → ZeroHearth → Appearance → Design*.

The third choice, *Terminal*, is marked experimental. It turns on terminal mode
(see [chapter 11](11-appearance.md)), which draws every board of the vault as
text, so it is vault-wide whichever run of the wizard picks it. It leaves the
Classic or Expressive choice underneath as it was, for when it is switched off
again. Terminal mode draws no wallpaper and no card surfaces, so with it chosen
the rest of the step is not shown, and the finish step's preview is drawn as
plain boxes.

The five backgrounds are *ZeroHearth's wallpaper* (hills drawn by the plugin, a
morning or a moonlit night with your theme — or, in the Expressive design, soft
shapes in your accent colour), *A harbour town* (a lighthouse, boats and houses
on a hill, in Expressive shapes), *Live sky* (a painted sky drawn from real weather over a place you
pick, or one condition pinned and kept), *A flat colour* (the lightest option
there is), and *None* (your theme's own background, untouched).

The three card surfaces are *Frosted* (translucent cards over a soft blur of the
background), *Solid* (opaque panels, easiest to read over a busy photograph) and
*Minimal* (no card surface at all, content floating on the background).

You also choose whether the background sits behind everything or is worn as a
*banner* strip across the top of the board, and whether the spacing is roomy, compact or flush.

**Step 3 — Your board.** A scale drawing of the board about to be built: the
chosen background, the header, and every card in its place and in the chosen
surface. The working cards fill a main column and the small ones — the clock, a
mini calendar, the weather, statistics — a column down the right, with each card
stretched to close the gaps around it.

Below the drawing you set the *Title* (the drawing follows as you type), whether
the board has a *Clock* (a small card at the top of the side column), and
whether the search bar is shown. *Title and header* folds away the rest: whether
the title is shown at all, the *Title icon* beside it (an emoji, a couple of
characters, a Lucide icon id, a vault image path, or an image URL — leave it
empty for the ZeroHearth crystal), and whether the title and/or icon follow your
theme's accent colour. You name the dashboard and choose whether it replaces the
board you are on or is added as a new one; *Why these cards* lists every card
with the reason it is there ("Daily notes is enabled", "Reading & feeds",
"Templater templates were found").

Nothing is written to your vault until you press **Build my dashboard**.

### What the wizard writes, and what it never touches

This distinction matters if you already have ZeroHearth set up the way you like it.

Everything the wizard sets lands as a **per-board override on the one dashboard
it builds**: the title, the title icon, the accent colour target, the card
surface, the spacing, and the background. The TaskNotes field mapping lands on
the Tasks card itself. Your vault-wide settings, and every other dashboard you
have, come out of a setup run exactly as they went in.

That is also why the wizard no longer asks about things that can only be
vault-wide — whether ZeroHearth opens on startup, where notes open, which search
engine to use, whose file icons to show. Those live in **Settings → ZeroHearth**,
one toggle each, and apply everywhere by design.

When you run the wizard again later from *Settings → ZeroHearth → About*, it
**always** adds a new dashboard. Every board you already have is left alone;
nothing is replaced or removed.

### If you skip the wizard

Skipping is a supported choice. You get ZeroHearth's starter dashboard, and you add
cards yourself with **Arrange → Add card**. See
[chapter 6](06-arranging-cards.md).

## What to do immediately after setup

The wizard's own closing advice is worth repeating, because it is accurate:
the board it built is a starting point, not a preset. ZeroHearth is built above all
to be customised, and the wizard touches only a fraction of it.

Three things to try first:

1. **Press Arrange** (top-right of the board). Drag a card. Resize it from a
   corner. Open a card's settings with its gear button. Add a card you did not
   ask the wizard for.
2. **Open the dashboard switcher** (top-left) and press **+** to make a second
   board. Give it an icon. Bind *Switch to dashboard 2* to a hotkey.
3. **Open Settings → ZeroHearth** and read down the eight categories. There is a
   great deal in there that the wizard never asked about.
