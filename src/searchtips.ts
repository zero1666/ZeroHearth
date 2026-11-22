/**
 * "What the search bar can do": one dialog listing every search syntax and
 * every instant answer, with examples that — opened from a search bar — are
 * typed into it on a click.
 *
 * Instant answers are only useful once someone knows to ask, so the dialog is
 * offered where the question comes up: a one-time hint in the dropdown the
 * first time an empty search bar is focused, a `?` typed into any search bar,
 * the "Show search tips" command, and a button in Settings → Appearance.
 */
import { type App } from "obsidian";
import { setIcon } from "./glyphs";
import { t } from "./i18n";
import { INSTANT_FEATURES, type InstantFeature } from "./instant";
import { ZeroHearthModal } from "./uidesign";

/** Local storage key (per vault, outside data.json) remembering that the
 * reader has seen the tips — once opened or dismissed, the hint stops. */
const SEEN_KEY = "zerohearth-search-tips-seen";

export function searchTipsSeen(app: App): boolean {
	return app.loadLocalStorage(SEEN_KEY) === true;
}

export function markSearchTipsSeen(app: App): void {
	app.saveLocalStorage(SEEN_KEY, true);
}

/** The icon each answer is shown with, here and in settings. */
export const INSTANT_FEATURE_ICONS: Record<InstantFeature, string> = {
	calc: "calculator",
	currency: "banknote",
	market: "trending-up",
	weather: "cloud-sun",
	wiki: "book-open",
	chance: "dices",
	date: "calendar",
	time: "clock",
};

type FindTip = "name" | "tag" | "property" | "command";
const FIND_TIPS: readonly FindTip[] = ["name", "tag", "property", "command"];
const FIND_ICONS: Record<FindTip, string> = {
	name: "search",
	tag: "hash",
	property: "list",
	command: "terminal-square",
};

export interface SearchTipsOptions {
	/** Whether an answer is on where the dialog was opened from. */
	enabled?: (feature: InstantFeature) => boolean;
	/** Type an example into the search bar the dialog was opened from. Absent
	 * when there is none (the command), and the examples are then plain text. */
	onTry?: (example: string) => void;
}

export class SearchTipsModal extends ZeroHearthModal {
	private opts: SearchTipsOptions;

	constructor(app: App, opts: SearchTipsOptions = {}) {
		super(app);
		this.opts = opts;
	}

	onOpen(): void {
		markSearchTipsSeen(this.app);
		const strings = t().search.tips;
		this.modalEl.addClass("zerohearth-tips-modal");
		this.titleEl.setText(strings.title);
		const body = this.contentEl;
		body.createEl("p", { cls: "zerohearth-modal-intro", text: this.opts.onTry ? strings.introTry : strings.intro });

		body.createEl("h3", { cls: "zerohearth-tips-heading", text: strings.findHeading });
		const find = body.createDiv("zerohearth-tips-list");
		for (const id of FIND_TIPS) {
			const tip = strings.find[id];
			this.row(find, FIND_ICONS[id], tip.title, tip.desc, tip.examples, true);
		}

		body.createEl("h3", { cls: "zerohearth-tips-heading", text: strings.answersHeading });
		const answers = body.createDiv("zerohearth-tips-list");
		for (const id of INSTANT_FEATURES) {
			const tip = strings.features[id];
			const on = this.opts.enabled?.(id) ?? true;
			this.row(answers, INSTANT_FEATURE_ICONS[id], tip.title, tip.desc, tip.examples, on);
		}
		body.createEl("p", { cls: "zerohearth-tips-footnote", text: strings.settingsHint });
	}

	onClose(): void {
		this.contentEl.empty();
	}

	private row(
		parent: HTMLElement,
		icon: string,
		title: string,
		desc: string,
		examples: readonly string[],
		on: boolean,
	): void {
		const row = parent.createDiv("zerohearth-tips-row");
		row.toggleClass("is-off", !on);
		setIcon(row.createDiv("zerohearth-tips-icon"), icon);
		const text = row.createDiv("zerohearth-tips-text");
		const head = text.createDiv("zerohearth-tips-title");
		head.createSpan({ text: title });
		if (!on) head.createSpan({ cls: "zerohearth-tips-off", text: t().search.tips.off });
		text.createDiv({ cls: "zerohearth-tips-desc", text: desc });
		const chips = text.createDiv("zerohearth-tips-examples");
		const onTry = on ? this.opts.onTry : undefined;
		for (const example of examples) {
			if (!onTry) {
				chips.createEl("code", { cls: "zerohearth-tips-example", text: example });
				continue;
			}
			const chip = chips.createEl("button", {
				cls: "zerohearth-tips-example is-clickable",
				text: example,
				attr: { type: "button", "aria-label": t().search.tips.tryAria(example) },
			});
			chip.addEventListener("click", () => {
				this.close();
				onTry(example);
			});
		}
	}
}
