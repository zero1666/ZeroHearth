import { setIcon } from "./glyphs";
import { t } from "./i18n";
import { descriptionIssues, descriptionLines, parseDescriptionLine } from "./taskdescription";

/**
 * Drawing a task's description, and the editor that says what one can hold.
 * The rules themselves are src/taskdescription.ts; this is their DOM, kept out
 * of the tasks card module (and its import cycle) so it can be tested under
 * jsdom.
 */

/** Opens a link from a description: a note link, or (`external`) a web one. */
export type DescriptionLinkOpener = (target: string, external: boolean, ev: MouseEvent) => void;

/** Draw one description line's inline Markdown — the forms that survive being
 * a sub-bullet — into `el`. Without `open`, links are drawn but inert. */
export function fillDescriptionLine(el: HTMLElement, line: string, open?: DescriptionLinkOpener): void {
	for (const seg of parseDescriptionLine(line)) {
		switch (seg.kind) {
			case "text":
				el.appendText(seg.text);
				break;
			case "bold":
				el.createEl("strong", { text: seg.text });
				break;
			case "italic":
				el.createEl("em", { text: seg.text });
				break;
			case "strike":
				el.createEl("del", { text: seg.text });
				break;
			case "highlight":
				el.createEl("mark", { text: seg.text });
				break;
			case "code":
				el.createEl("code", { text: seg.text });
				break;
			case "tag":
				el.createSpan({ cls: "zerohearth-task-desc-tag", text: seg.text });
				break;
			case "wikilink":
			case "link": {
				const link = el.createSpan({ cls: "zerohearth-task-link", text: seg.text });
				if (!open) break;
				const external = seg.kind === "link" && /^https?:\/\//i.test(seg.target);
				const target = seg.target;
				link.addEventListener("click", (ev) => {
					ev.stopPropagation();
					ev.preventDefault();
					open(target, external, ev);
				});
				break;
			}
		}
	}
}

/** A description as muted sub-bullets, one per stored line. */
export function renderDescriptionLines(parent: HTMLElement, description: string, open?: DescriptionLinkOpener): void {
	const lines = descriptionLines(description);
	if (!lines.length) return;
	const wrap = parent.createDiv("zerohearth-task-desc");
	for (const line of lines) {
		const item = wrap.createDiv("zerohearth-task-desc-line");
		item.createSpan({ cls: "zerohearth-task-desc-bullet", text: "•" });
		fillDescriptionLine(item.createSpan({ cls: "zerohearth-task-desc-text" }), line, open);
	}
}

/**
 * A description textarea with the rules beside it: a collapsible guide to what
 * a description line can hold (each line is stored as one sub-bullet under the
 * task, so inline Markdown works and block Markdown doesn't), and a live
 * warning naming any line that falls on the wrong side of that before it is
 * saved. Appended to `row`; returns the textarea, and a switch for the
 * guidance — a note body (the add form's "Create as note") is a whole note,
 * where everything works.
 */
export function descriptionEditor(
	row: HTMLElement,
	value: string,
): { area: HTMLTextAreaElement; setGuided: (on: boolean) => void } {
	const help = t().cards.tasks.descHelp;
	const field = row.createDiv("zerohearth-taskdesc-field");
	const area = field.createEl("textarea", {
		cls: "zerohearth-taskdetail-desc",
		attr: { rows: "3", placeholder: t().cards.tasks.descriptionPlaceholder },
	});
	area.value = value;
	const guide = field.createDiv("zerohearth-taskdesc-help");
	const issues = guide.createDiv({ cls: "zerohearth-taskdesc-issues", attr: { "aria-live": "polite" } });
	const details = guide.createEl("details", { cls: "zerohearth-taskdesc-guide" });
	details.createEl("summary", { text: help.summary });
	details.createDiv({ cls: "zerohearth-taskdesc-intro", text: help.intro });
	const cols = details.createDiv("zerohearth-taskdesc-cols");

	const column = (cls: string, icon: string, title: string) => {
		const col = cols.createDiv(`zerohearth-taskdesc-col ${cls}`);
		const head = col.createDiv("zerohearth-taskdesc-col-head");
		setIcon(head.createSpan("zerohearth-taskdesc-col-icon"), icon);
		head.createSpan({ text: title });
		return col;
	};
	const works = column("is-works", "check", help.works);
	for (const [sample, name] of help.worksItems) {
		const item = works.createDiv("zerohearth-taskdesc-item");
		item.createEl("code", { cls: "zerohearth-taskdesc-sample", text: sample });
		// What it turns into, then what it is called.
		const result = item.createSpan("zerohearth-taskdesc-result");
		fillDescriptionLine(result.createSpan("zerohearth-taskdesc-preview"), sample);
		result.createSpan({ cls: "zerohearth-taskdesc-name", text: name });
	}
	const fails = column("is-fails", "x", help.fails);
	for (const [sample, name] of help.failsItems) {
		const item = fails.createDiv("zerohearth-taskdesc-item");
		item.createEl("code", { cls: "zerohearth-taskdesc-sample", text: sample });
		item.createSpan({ cls: "zerohearth-taskdesc-name", text: name });
	}

	let guided = true;
	const check = () => {
		issues.empty();
		const found = guided ? descriptionIssues(area.value) : [];
		issues.toggleClass("is-empty", found.length === 0);
		area.toggleClass("has-issues", found.length > 0);
		for (const f of found.slice(0, 3)) {
			const line = issues.createDiv("zerohearth-taskdesc-issue");
			setIcon(line.createSpan("zerohearth-taskdesc-issue-icon"), "alert-triangle");
			line.createSpan({ text: help.issueLine(f.line, help.issues[f.issue]) });
		}
		if (found.length > 3) issues.createDiv({ cls: "zerohearth-taskdesc-issue is-more", text: help.moreIssues(found.length - 3) });
	};
	area.addEventListener("input", check);
	check();
	return {
		area,
		setGuided: (on) => {
			guided = on;
			guide.toggle(on);
			check();
		},
	};
}
