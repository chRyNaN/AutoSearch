AutoSearch
==========

A JavaScript Auto-Complete implementation that currently uses Bootstrap as a dependancy. 

Development Rules
==========

* Limited JQuery Use
  * Library should be written in plain JavaScript, only use JQuery if absolutely necessary.
* Avoid Hungarian Notation
  * Often used to denote a private variable, such as: ***_pv***.
  * Instead, use headless camel casing, such as: ***betterApproach***. 
  * Make use of Closures for private variables.
* Maintain Single File Dependancy
  * No CSS files. If CSS is necessary, create and apply the styles or classes in JavaScript.
  * Numerous JavaScript files must be minified into a single file for use.
* Focus On Loose Browser Compatability
  * Should be compatable with current versions of ***Firefox***, ***Chrome***, and ***Opera***.
  * ***Internet Explorer***, ***Safari***, and outdated browser versions are not a necessity, however, a nice possible benefit. 
* Retain Ease-Of-Use Approach
  * The library should be simple to implement.
  * Instantiation of only one Object needed, for instance: ***var search = new AutoSearch()***
  * Methods and variables are clear and their meanings are understood.
  * Attributes have fallbacks if possible.
  * Structure and use is easy to follow; user is aware of any required methods and order of their calls.
