import Head from "next/head";
import * as React from "react";

export default function BlogPage(props: {apiHost: string; children: React.ReactNode}) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="stylesheet" href="/blog.css" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" title="Thinktool" type="application/rss+xml" href="https://thinktool.io/blog.rss" />
      </Head>
      <div className="top-bar">
        <a href="/">
          <span id="logo">Thinktool</span>
          <span className="tagline">An associative note-taking app.</span>
        </a>
      </div>
      {props.children}
      <div className="newsletter-outer">
        <div className="newsletter">
          <div>
            <h1>Thanks for reading. </h1>
            <p>This is the blog for Thinktool, an associative note-taking app that I'm currently building.</p>
            <p>Subscribe to the newsletter below if you want to receive occasional news about major updates.</p>
          </div>
          <form action={`${props.apiHost}/newsletter/subscribe`} method="POST">
            <input type="email" name="email" required placeholder="you@example.com" />
            <input type="submit" value="Subscribe" />
          </form>
        </div>
      </div>
      <footer>
        Made by{" "}
        <a href="https://johv.dk/">
          <span>Jonas Hvid</span>
        </a>
        . Message me at{" "}
        <a className="email" href="mailto:jonas@thinktool.io">
          <span>jonas@thinktool.io</span>
        </a>
        .
      </footer>
      <script data-goatcounter="https://counter.thinktool.io/count" async src="//counter.thinktool.io/count.js" />
    </>
  );
}
