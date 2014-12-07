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

Functionality
==========

* Turns any <input> element into an auto-complete search box. 
* Currently, uses **Dropdown.js** within **Bootstrap** to display the dropdown containing the search results.
* Accepts local and/or remote data.
* As the user types, it will automatically filter through the data and display the most relevant results.

Constructor
==========

```javascript
new AutoSearch(element)
```
where ***element*** is the `<input>` **HTMLElement** that the auto-complete will be bound to.

Methods
==========

###remoteSource(source)###
Sets the location of the server-side data. ***source*** is of type **String** and is the location of the resource to access. The remote source is accessed using a **GET** request. Therefore, this can be set to a **REST** service. Note: The dropdown with the search results will not display unless remote and/or local data has been set with the *remoteSource* and *localSource* methods.
###localSource(source)###
Sets the local data. ***source*** is an **Array** which contains the data to be accessed. Note: The dropdown with the search results will not display unless remote and/or local data has been set with the *remoteSource* and *localSource* methods.
###setMinCharacters(amount)###
Sets the amount of characters entered into the `<input>` element needed to perform the search. ***amount*** is of type **Number** but will be lenient and allow a **String** to be entered. In this case, the **String** will be converted to the appropriate number. Defaults to 3.
###customize(element)###
Sets the layout of each list item in the dropdown. ***element*** is of type **HTMLElement** and will be wrapped in a `<li>` tag and placed within a list. An event handler will be registered to the list item for when an item is selected. Defaults to a single `<p>` tag containing the first **String** within the appropriate item in the dataset. Currently, only way to access the data (for layout) is to use `data[i]` followed by any attribute your aware of, for instance: `data[i].firstName`.
###showBold(bool)###
States whether or not to display the matching items in the dropdown in bold. 
