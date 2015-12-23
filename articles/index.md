---
layout: page
title: Articles Index
---

<table>
	<thead><tr><th>Date</th><th>Article</th></tr></thead>
	<tbody>
	{% for post in site.posts %}
		<tr><td>{{ post.date | date_to_string }}</td><td><a href="{{ post.url }}">{{ post.title }}</a></td></tr>
	{% endfor %}
	</tbody>
</table>