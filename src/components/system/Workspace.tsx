"use client";

import {
  experience,
  graveyard,
  projects,
  research,
  siteIdentity,
  skillGroups,
} from "@/content/site";
import { useSystem } from "./SystemProvider";

function ModuleHeader({ index, label, path }: { index: string; label: string; path: string }) {
  return (
    <header className="module-header">
      <div>
        <p className="eyebrow">MODULE {index}</p>
        <h1>{label}<span className="blink">_</span></h1>
      </div>
      <p className="module-path">{path}</p>
    </header>
  );
}

function HomeModule() {
  const { navigate, dispatch } = useSystem();
  return (
    <section className="module home-module" aria-labelledby="home-title">
      <div className="home-grid">
        <div className="home-copy">
          <p className="prompt-line">moaz@portfolio:~$ ./whoami --verbose</p>
          <p className="boot-ok">[ IDENTITY RESOLVED ]</p>
          <h1 id="home-title">I build systems people can <em>understand.</em></h1>
          <p className="lede">{siteIdentity.summary}</p>
          <div className="action-row">
            <button className="primary-action" type="button" onClick={() => navigate("projects")}>
              <span>VIEW PROJECTS</span><b aria-hidden="true">→</b>
            </button>
            <button className="text-action" type="button" onClick={() => navigate("resume")}>
              READ RESUME
            </button>
          </div>
        </div>
        <aside className="identity-card" aria-label="Profile summary">
          <div className="avatar-grid" aria-hidden="true">
            <span>M0</span><span>AZ</span>
          </div>
          <dl>
            <div><dt>USER</dt><dd>{siteIdentity.name}</dd></div>
            <div><dt>ROLE</dt><dd>Software engineer</dd></div>
            <div><dt>FOCUS</dt><dd>Systems / Product / Research</dd></div>
            <div><dt>STATUS</dt><dd><i className="status-dot" /> Building</dd></div>
          </dl>
        </aside>
      </div>
      <div className="focus-strip">
        <span className="strip-label">CURRENT_FOCUS</span>
        <p>{siteIdentity.currentFocus}</p>
        <button type="button" onClick={() => dispatch({ type: "TOGGLE_TERMINAL", expanded: true })}>
          OPEN TERMINAL <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}

function AboutModule() {
  return (
    <article className="module prose-module">
      <ModuleHeader index="01" label="ABOUT" path="~/about/bio.md" />
      <div className="prose-grid">
        <div>
          <p className="drop-line">SYSTEM PROFILE</p>
          <p className="large-copy">{siteIdentity.role}</p>
          <p>{siteIdentity.summary}</p>
          <p>
            My default mode is to make hidden behavior visible: state boundaries,
            failure modes, operating assumptions, and the decisions that shape a product.
          </p>
        </div>
        <dl className="fact-list">
          <div><dt>VALUES</dt><dd>Clarity · resilience · craft</dd></div>
          <div><dt>METHOD</dt><dd>Observe → model → build → verify</dd></div>
          <div><dt>INTERESTS</dt><dd>Systems, product engineering, HCI, research</dd></div>
          <div><dt>NOW</dt><dd>{siteIdentity.currentFocus}</dd></div>
        </dl>
      </div>
    </article>
  );
}

function ProjectsModule() {
  const { navigate } = useSystem();
  return (
    <section className="module">
      <ModuleHeader index="02" label="PROJECTS" path="~/projects" />
      <div className="table-labels" aria-hidden="true">
        <span>ID / PROJECT</span><span>DOMAIN</span><span>STATUS</span>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <button
            className="project-row"
            key={project.slug}
            type="button"
            onClick={() => navigate("project", project.slug)}
          >
            <span className="project-title"><b>{project.id}</b><span><strong>{project.name}</strong><small>{project.oneLineDescription}</small></span></span>
            <span>{project.category}</span>
            <span className={`status-pill status-${project.status.toLowerCase()}`}>{project.status}</span>
          </button>
        ))}
      </div>
      <p className="module-footnote">TIP: type <code>ssh &lt;project&gt;</code> to mount a project environment.</p>
    </section>
  );
}

function ProjectModule({ slug }: { slug: string | null }) {
  const { navigate, dispatch } = useSystem();
  const project = projects.find((item) => item.slug === slug) ?? projects[0];
  return (
    <article className="module project-detail">
      <button className="back-link" type="button" onClick={() => navigate("projects")}>← BACK TO PROJECTS</button>
      <div className="project-hero">
        <div>
          <p className="eyebrow">PROJECT {project.id} / {project.status}</p>
          <h1>{project.name}</h1>
          <p className="lede">{project.oneLineDescription}</p>
        </div>
        <dl className="project-meta">
          <div><dt>ROLE</dt><dd>{project.role}</dd></div>
          <div><dt>PERIOD</dt><dd>{project.period}</dd></div>
          <div><dt>STACK</dt><dd>{project.stack.join(" · ")}</dd></div>
        </dl>
      </div>
      <div className="case-grid">
        <section><span>01 // PROBLEM</span><p>{project.problem}</p></section>
        <section><span>02 // SOLUTION</span><p>{project.solution}</p></section>
        <section className="wide"><span>03 // ARCHITECTURE</span><ol>{project.architecture.map((item) => <li key={item}>{item}</li>)}</ol></section>
        <section><span>04 // ENGINEERING</span><ul>{project.engineeringHighlights.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><span>05 // CHALLENGES</span><ul>{project.challenges.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="wide"><span>06 // RESULTS</span><ul>{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></section>
      </div>
      <div className="action-row">
        <button
          className="primary-action"
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_TERMINAL", expanded: true })}
        >MOUNT PROJECT HOST <b aria-hidden="true">→</b></button>
        {project.links.map((link) => <a className="text-action" href={link.href} key={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}
      </div>
    </article>
  );
}

function ExperienceModule() {
  return (
    <section className="module">
      <ModuleHeader index="03" label="EXPERIENCE" path="~/experience/timeline.md" />
      <div className="timeline">
        {experience.map((item, index) => (
          <article className="timeline-item" key={item.role}>
            <div className="timeline-marker"><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div>
              <p className="eyebrow">{item.period} · {item.context}</p>
              <h2>{item.role}</h2>
              <p>{item.summary}</p>
              <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
      <p className="privacy-note">Publication boundary: organization names and private résumé details are added only after owner review.</p>
    </section>
  );
}

function ResearchModule() {
  return (
    <section className="module">
      <ModuleHeader index="04" label="RESEARCH" path="~/research" />
      <div className="research-grid">
        {research.map((item) => (
          <article className="research-card" key={item.id}>
            <div><span>{item.id}</span><b>{item.status}</b></div>
            <h2>{item.title}</h2><p>{item.abstract}</p>
            <ul>{item.tags.map((tag) => <li key={tag}>#{tag}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsModule() {
  return (
    <section className="module">
      <ModuleHeader index="05" label="PROCESS LOAD" path="~/skills --active" />
      <p className="section-intro">These are working areas, not scientific competency scores. LOAD describes current attention.</p>
      <div className="process-table">
        <div className="process-head"><span>PID</span><span>LOAD</span><span>PROCESS</span><span>WORKING SET</span></div>
        {skillGroups.map((group, index) => (
          <article key={group.name}>
            <span>{101 + index}</span><strong>{group.load}</strong><h2>{group.name}</h2>
            <div><p>{group.note}</p><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LabModule() {
  return (
    <section className="module">
      <ModuleHeader index="06" label="LAB" path="~/lab" />
      <div className="lab-intro"><p>Experiments can be valuable before they are polished. The lab keeps incomplete work honest and inspectable.</p><code>ls -la ~/lab</code></div>
      <div className="lab-grid">
        <article><span>drwxr-xr-x</span><h2>experiments/</h2><p>Bounded questions, simulators, and interaction probes.</p></article>
        <article><span>drwxr-xr-x</span><h2>prototypes/</h2><p>Small systems that test one architectural claim at a time.</p></article>
        <article className="graveyard-card"><span>drwx------</span><h2>.graveyard/</h2><p>{graveyard.length} archived ideas. Discoverable from the shell.</p></article>
      </div>
    </section>
  );
}

function ContactModule() {
  return (
    <section className="module contact-module">
      <ModuleHeader index="07" label="CONTACT" path="~/contact" />
      <div className="contact-grid">
        <div><p className="large-copy">Start a useful conversation.</p><p>For engineering, research, or thoughtful collaboration, the public GitHub channel is online. Private channels stay offline until the owner explicitly configures a publication-safe address.</p></div>
        <div className="channel-list">
          <a href={siteIdentity.github} target="_blank" rel="noreferrer"><span>01</span><strong>GITHUB</strong><small>ONLINE</small><b>↗</b></a>
          <div aria-disabled="true"><span>02</span><strong>EMAIL</strong><small>NOT CONFIGURED</small><b>—</b></div>
          <div aria-disabled="true"><span>03</span><strong>LINKEDIN</strong><small>NOT CONFIGURED</small><b>—</b></div>
        </div>
      </div>
    </section>
  );
}

function ResumeModule() {
  return (
    <article className="module resume-module">
      <ModuleHeader index="R" label="RESUME" path="~/resume" />
      <div className="resume-sheet">
        <div><p className="eyebrow">PROFILE</p><h2>{siteIdentity.name}</h2><p>{siteIdentity.role}</p><p>{siteIdentity.summary}</p></div>
        <div><p className="eyebrow">CORE PRACTICE</p><ul>{skillGroups.flatMap((group) => group.items).slice(0, 10).map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><p className="eyebrow">SELECTED WORK</p>{projects.map((project) => <p key={project.slug}><strong>{project.name}</strong><br />{project.oneLineDescription}</p>)}</div>
      </div>
      <p className="privacy-note">A downloadable résumé is intentionally not copied from this workstation. Configure a reviewed public PDF in <code>src/content/site.ts</code>.</p>
    </article>
  );
}

export function Workspace() {
  const { state } = useSystem();
  const modules = {
    home: <HomeModule />, about: <AboutModule />, projects: <ProjectsModule />,
    project: <ProjectModule slug={state.activeProjectSlug} />, experience: <ExperienceModule />,
    research: <ResearchModule />, skills: <SkillsModule />, lab: <LabModule />,
    contact: <ContactModule />, resume: <ResumeModule />,
  };
  return <main className="workspace" id="main-content">{modules[state.activeSection]}</main>;
}
