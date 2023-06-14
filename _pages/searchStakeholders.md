---
layout: search
permalink: /searchstakeholders/
nav_order: 2
script: scripts/searchStakeholders.html
exclude: true
other_type: metadata
--- 

<center>
{% include textinputfield.html placeholder="Search" id="searchID" %}
<br><br>
{% include textinputfield.html placeholder="Type" id="typeID" options="typeOptions" %}
<br><br>
{% include button.html text="Search" big=true id="searchButtonID" %} 
</center>