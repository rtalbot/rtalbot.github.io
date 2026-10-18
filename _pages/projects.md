---
layout: content
title: Projects
permalink: /projects/
---
Games, tools and experiments that run in the browser. Everything here works client-side, so nothing you load into a tool leaves your machine.

<ul class="c-cards">
  {% for project in site.data.projects %}
  {% include project-card.html project=project %}
  {% endfor %}
</ul>
