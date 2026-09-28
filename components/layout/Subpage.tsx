import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./Subpage.module.css";

type Props = {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  /** shown under the title, e.g. "Last updated …" */
  note?: string;
  children?: ReactNode;
};

/** The frame for the pages outside the landing page: header, one reading column, footer. */
export default function Subpage({ eyebrow, title, intro, note, children }: Props) {
  return (
    <>
      <Header />
      <main id="main" className={styles.main}>
        <div className={`canvas ${styles.col}`}>
          <p className="c5-lab">{eyebrow}</p>
          <h1 className={styles.h1}>{title}</h1>
          {intro && <div className={styles.intro}>{intro}</div>}
          {note && <p className={styles.note}>{note}</p>}
          {children && <div className={styles.body}>{children}</div>}
        </div>
      </main>
      <Footer />
    </>
  );
}
