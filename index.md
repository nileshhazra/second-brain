---
layout: default
title: Home
---

## Hi, I am Nilesh

I am a data professional, passionate about building solutions with data.

<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <a class="post-link" href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>

      <div class="post-meta">
        <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>

        {% assign words = post.content | number_of_words %}
        {% assign reading_time = words | divided_by: 180 %}
        {% if reading_time == 0 %}
          {% assign reading_time = 1 %}
        {% endif %}
        <span class="post-reading-time">· {{ reading_time }} min read</span>
      </div>

      <p class="post-excerpt">
        {{ post.excerpt }}
      </p>

    </li>

{% endfor %}

</ul>
