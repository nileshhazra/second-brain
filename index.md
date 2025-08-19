---
layout: default
title: Home
---

# My Second Brain 🌱

A collection of my learnings, ideas, and fleeting thoughts.

---

## Latest Posts

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
      - <span>{{ post.date | date: "%B %d, %Y" }}</span>
    </li>
  {% endfor %}
</ul>
