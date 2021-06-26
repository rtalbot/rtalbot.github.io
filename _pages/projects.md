---
layout: content
title: Projects
permalink: /projects/
---
<section class="c-archives">
  <link rel="shortcut icon" href="">
  {% for project in site.data.projects  %}
  {% if forloop.first %}
  <ul class="c-archives__list">
    {% endif %}
    <li class="c-archives__item">
      <h3>
        <a href="{{ project.link | prepend: site.baseurl }}">{{project.name}}</a>
        <br>
        <small>{{project.description}}</small>
      </h3>
    </li>
    {% if forloop.last %}
  </ul>  
  {% endif %}
  {% endfor %}
</section>
