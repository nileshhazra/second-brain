---
layout: default
title: Home
---

<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <a class="post-link" href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
      <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
    </li>
  {% endfor %}
</ul>
