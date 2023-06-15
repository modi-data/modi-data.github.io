---
layout: search
permalink: /searchstakeholders/
nav_order: 2
script: scripts/searchStakeholders.html
exclude: true
other_type: metadata
--- 

<center>
<h2>Search for stakeholders</h2>
<br>
{% include textinputfield.html placeholder="Search" id="searchID" %}
<br><br>
{% include textinputfield.html placeholder="Type" id="typeID" options="typeOptions" %}
<br><br>
{% include textinputfield.html placeholder="Location" id="locationID" %}
<br><br>
{% include button.html text="Search" big=true id="searchButtonID" %} 
</center>