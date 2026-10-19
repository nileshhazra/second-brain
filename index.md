---
layout: default
title: Home
---

<!-- Hero Section with Intro & 3D Stage -->
<section class="garden-hero">
  <div class="hero-text-block">
    <div class="hero-pill-badge">
      <span class="badge-dot pulse"></span>
      <span>Living Digital Garden</span>
    </div>
    <h1 class="hero-title">Nilesh Hazra</h1>
    <p class="hero-tagline">
      Data professional passionate about solving complex challenges with data architecture, system design, and practical experience.
    </p>
    <div class="hero-quick-stats">
      <div class="stat-pill">
        <span class="stat-num">{{ site.posts.size }}</span>
        <span class="stat-label">Published Insights</span>
      </div>
      <div class="stat-pill">
        <span class="stat-num">GitHub Issues</span>
        <span class="stat-label">Headless CMS</span>
      </div>
      <div class="stat-pill">
        <span class="stat-num">Global Mesh</span>
        <span class="stat-label">3D Network Globe</span>
      </div>
    </div>
  </div>

  <!-- Interactive 3D Earth Globe with Animated Network Connections -->
  {% include globe-3d.html %}
</section>

<!-- Interactive Explorer Toolbar: Search & Tag Filter -->
<section class="garden-explorer-bar">
  <div class="explorer-header">
    <h2 class="section-title">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>Knowledge Garden</span>
    </h2>
    <span id="search-results-count" class="search-results-count">Showing {{ site.posts.size }} thoughts</span>
  </div>

  <div class="search-input-wrapper">
    <svg class="search-lens-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input 
      type="text" 
      id="post-search-input" 
      class="post-search-input" 
      placeholder="Search insights by title, concept, or tag..." 
      aria-label="Search posts"
      autocomplete="off">
    <div class="search-shortcuts-dock">
      <button id="search-clear-btn" class="search-clear-btn" style="display: none;" title="Clear search" aria-label="Clear search">✕</button>
      <kbd class="kbd-hint" title="Press '/' or Cmd+K to search">/</kbd>
    </div>
  </div>

  <div class="filter-tags-scroll">
    <button class="filter-tag-pill active" data-tag="all">All ({{ site.posts.size }})</button>
    <button class="filter-tag-pill" data-tag="system design">System Design</button>
    <button class="filter-tag-pill" data-tag="data engineering">Data Engineering</button>
    <button class="filter-tag-pill" data-tag="python">Python</button>
    <button class="filter-tag-pill" data-tag="artificial intelligence">AI &amp; ML</button>
  </div>
</section>

<!-- Post Cards List with 3D Interactive Tilt -->
<ul class="post-cards-grid" id="post-cards-grid">
  {% for post in site.posts %}
    {% assign words = post.content | number_of_words %}
    {% assign reading_time = words | divided_by: 180 %}
    {% if reading_time == 0 %}
      {% assign reading_time = 1 %}
    {% endif %}

    {% capture post_tags_string %}
      {% for tag in post.tags %}{{ tag | downcase }} {% endfor %}
    {% endcapture %}

    <li class="post-item-card tilt-card" 
        data-title="{{ post.title | escape }}" 
        data-tags="{{ post_tags_string | strip | escape }}" 
        data-excerpt="{{ post.excerpt | strip_html | strip_newlines | escape }}">
      
      <a class="post-card-inner-link" href="{{ site.baseurl }}{{ post.url }}">
        <div class="post-card-top">
          <div class="post-meta-line">
            <span class="post-date-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
              </svg>
              {{ post.date | date: "%b %d, %Y" }}
            </span>
            <span class="post-time-badge">· {{ reading_time }} min read</span>
          </div>

          <div class="post-card-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </div>

        <h3 class="post-card-title">{{ post.title }}</h3>

        {% if post.excerpt %}
        <p class="post-card-excerpt">
          {{ post.excerpt | strip_html | truncatewords: 28 }}
        </p>
        {% endif %}

        {% if post.tags.size > 0 %}
        <div class="post-card-tags">
          {% for tag in post.tags %}
            {% if tag != "" and tag != nil %}
              <span class="tag-chip">#{{ tag | strip }}</span>
            {% endif %}
          {% endfor %}
        </div>
        {% endif %}
      </a>
    </li>
  {% endfor %}
</ul>

<!-- Empty state if search finds nothing -->
<div id="search-empty-state" class="search-empty-state" style="display: none;">
  <div class="empty-icon">🔍</div>
  <h3>No thoughts found</h3>
  <p>Try searching for another keyword or reset the filters.</p>
  <button id="reset-filter-btn" class="reset-filter-btn">Reset Filters</button>
</div>
