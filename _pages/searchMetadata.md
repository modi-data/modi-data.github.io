---
layout: search
title: Search
permalink: /searchmetadata/
nav_order: 2
script: scripts/searchMetadata.js
other_type: stakeholders
--- 

<center>
<h2>Search for metadata</h2>
<br>
{% include textinputfield.html placeholder="Search" id="searchID" %}
<br><br>
{% include textinputfield.html placeholder="Stakeholder" id="stakeholderID" options="stakeholderOptions" %}
<br><br>
{% include textinputfield.html placeholder="Location" id="locationID" %}
<br><br>
{% include textinputfield.html type="date" placeholder="Date" id="dateID" %}
<br><br>
{% include button.html text="Search" big=true id="searchButtonID" %} 
</center>