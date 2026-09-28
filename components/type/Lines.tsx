import { Fragment } from "react";

/**
 * A headline set as masked lines for the `.c5-ln` reveal. The lines are separate blocks, so a
 * space is written between them: it collapses on screen but keeps the sentence intact for
 * copy-paste, search and screen readers ("The event ends. The conversation…").
 */
export default function Lines({ lines }: { lines: readonly string[] }) {
  return lines.map((l, i) => (
    <Fragment key={l}>
      {i > 0 && " "}
      <span className="c5-ln">
        <span>{l}</span>
      </span>
    </Fragment>
  ));
}
