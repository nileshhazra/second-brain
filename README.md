<div align="center">
  <br />
  <p>
    <a href="https://nileshhazra.github.io/second-brain/"><img src="https://static.vecteezy.com/system/resources/previews/047/409/822/non_2x/human-brain-tree-a-tree-make-by-human-brain-concept-free-png.png" width="120" alt="logo" /></a>
  </p>
  <br />
  <p>
    <a href="https://nileshhazra.github.io/second-brain/" style="font-size: 24px; font-weight: bold; text-decoration: none;">Second Brain</a>
  </p>
  <p>
    A frictionless, automated second brain to capture, organize, and share knowledge.
  </p>
  <p>
    <a href="https://github.com/nileshhazra/second-brain/issues"><img alt="Contributions Welcome" src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square"></a>
    <a href="https://github.com/nileshhazra/second-brain/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square"></a>
    <a href="https://github.com/nileshhazra/second-brain/actions"><img alt="GitHub Actions Status" src="https://github.com/nileshhazra/second-brain/actions/workflows/issue-to-post.yml/badge.svg"></a>
  </p>
</div>

---

## A Record of Curiosity

This repository is the engine for a unique kind of blog: a **second brain** where ideas are captured the moment they spark. The core philosophy is to eliminate the friction between thought and publication. Instead of a cumbersome process of cloning repos and writing markdown, new posts are created simply by opening a GitHub Issue.

> **The Problem:** Traditional blogging has too many steps. An idea in the shower is often lost by the time you're at your desk.
>
> **The Solution:** What if logging an idea was as easy as reporting a bug? This project makes that possible.

This system uses a GitHub Action to automatically convert new issues into formatted blog posts, which are then published as a static site via GitHub Pages. It's a living archive of learning, built for the speed of thought.

---

## ✨ Features

* **Interactive 3D Second Brain (WebGL / Three.js):** Real-time procedural dual-hemisphere 3D neural brain graph with synaptic axons, dynamic action potential pulses, drag-to-rotate orbital controls, and click-to-fire synaptic surge waves.
* **Embedded 3D Model Viewer (`<model-viewer>`):** Native support for viewing 3D GLB/glTF models with 360° rotation, zoom, camera controls, and Augmented Reality (AR) in any post or header via `{% include model-viewer.html %}`.
* **Instant Post Search & Tag Filtering:** Client-side real-time fuzzy search bar with keyboard shortcut (`/` or `Cmd+K`) and interactive tag pills (`#system-design`, `#data-engineering`, `#python`, `#ai`).
* **Interactive 3D Card Tilt & Sheen:** Tactile 3D perspective tilt and dynamic cursor sheen reflections on post preview cards.
* **Interactive Micro-Interactions & Audio Synthesizer:**
  * **Sparks / Reactions:** Post "Brain Spark" counter backed by `localStorage` with floating particle bursts.
  * **Audio Synthesis (Web Audio API):** Procedural futuristic sound effects for theme toggling, synaptic pulses, and clicks (with instant mute control).
  * **Reading Progress Bar:** Top glowing gradient progress bar tracking scroll depth on post pages.
  * **One-Click Code Copy:** Automatic language badge and animated copy-to-clipboard button on all code snippets.
  * **Circular Back-To-Top Button:** Floating progress ring tracking document scroll percentage.
* **Frictionless Publishing:** Create a new blog post just by opening a GitHub Issue. No local setup needed.
* **Fully Automated:** A GitHub Action handles the conversion from issue to post, including front matter and tags.
* **Adaptive Theme System:** Dark (cyberpunk violet & bioluminescent cyan) and Light modes with seamless CSS variable transitions.
* **Fast & Free Hosting:** Built on Jekyll and hosted for free on GitHub Pages.

---

## 🚀 Make It Your Own

You can create your own version of this second brain. Here’s how:

1.  **Fork this Repository:**
    Click the "Fork" button at the top right of this page to copy this project to your own GitHub account.

2.  **Enable GitHub Pages:**
    * In your forked repository, go to **Settings > Pages**.
    * Under "Build and deployment," select **GitHub Actions** as the source. This is a new, more powerful way to deploy Pages.

3.  **Grant Permissions:**
    * Go to **Settings > Actions > General**.
    * Scroll down to "Workflow permissions" and select **"Read and write permissions"**. This is crucial for the Action to be able to create post files in your repository. Click **Save**.

4.  **Customize Your Site:**
    * Open the `_config.yml` file and change the `title`, `author`, and `description` to your own.
    * Replace the SVG logo and social links in `_layouts/default.html` to personalize your site.

5.  **Start Writing!**
    * Go to the **Issues** tab in your repository.
    * Click **"New Issue"**. The title will be your post's title, and the body will be the content.
    * Once you submit the issue, the GitHub Action will automatically create the post. It may take a minute or two to appear on your live site.

---

## 🤝 How to Contribute

This project thrives on community input. Here are the best ways to contribute:

* **Suggest a Post:** Open an **[Issue](https://github.com/nileshhazra/second-brain/issues)** with an interesting idea, a code snippet you've learned, or a summary of an article. If it's a good fit, it will be added to the knowledge base.
* **Propose Features:** Have an idea to improve the system? Start a conversation in our **[Discussions](https://github.com/nileshhazra/second-brain/discussions)** tab.
* **Report a Bug:** If you find something that's not working, please open an issue detailing the problem.

---

## 🛠️ Technology Stack

* **Content Management:** GitHub Issues as a "Headless CMS"
* **Automation:** GitHub Actions
* **Site Generation:** Jekyll
* **Hosting:** GitHub Pages
* **Design:** Custom HTML & SCSS

<br/>

<div align="center">
  Made with curiosity
</div>
