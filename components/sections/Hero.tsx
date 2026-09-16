import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={`${styles.hero} relative flex min-h-svh items-center overflow-hidden pt-[104px] md:pt-[120px]`}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-night" aria-hidden="true">
        <Image
          src="/images/hero-aura.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${styles.shot}`}
        />
      </div>
      <div className="canvas relative z-[3] text-center">
        <span className={styles.vignette} aria-hidden="true" />
        <h1 className="h1 enter mx-auto max-w-[980px]" style={{ animationDelay: "150ms" }}>
          Where crypto compliance continues.
        </h1>
        <p className={`lead enter mx-auto mt-8 ${styles.lead}`} style={{ animationDelay: "300ms" }}>
          A private network for the people navigating financial crime, regulation and risk in digital assets — through
          trusted intelligence, considered introductions and closed-door convenings.
        </p>
        <div className="enter mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: "300ms" }}>
          <a className="btn btn-brass" href="#request">
            Request consideration
          </a>
          <a className="btn btn-ghost-brass" href="#room">
            Explore what happens inside
          </a>
        </div>
        <p className="meta enter mt-[72px]" style={{ animationDelay: "550ms" }}>
          Inside Vault ↓
        </p>
      </div>
    </section>
  );
}
