var AutoSearch = (function(element){
	var highlightColor = "rgba(33, 150, 243, 0.4)", startAmount = 3, bold = true, VERSION = "0.0.1";
	var input = "", searchBox = {}, searchDropdown = {}, cache = [];
	
	function init(){
		if (typeof Bootstrap === 'undefined'){
			console.error("Bootstrap is a required dependancy.");
			return;
		}
		if (typeof element === 'string'){
			searchBox = document.querySelector(element);
			if (searchBox == null) return;
		}else if (element instanceof HTMLElement){
			searchBox = element;
		}else{
			console.error("Element is not defined or is not of type HTMLElement.");
			return;
		}
		searchDropdown = document.createElement("ul");
		searchDropdown.className = "dropdown-menu list-group";
		//add dropdown to parent and add event listeners to the input box
		searchBox.parentNode.appendChild(searchDropdown);
		searchBox.addEventListener('input', inputEvent);
		searchBox.addEventListener('blur', blurEvent);
		searchBox.addEventListener('keydown', keyDownEvent);
		searchBox.addEventListener('keyup', keyUpEvent);
	}
	
	function getSearchResults(searchString){
		$.ajax({
			url: "http://localhost:8080/UserInterface/rs/user/search/" + searchString,
			type: "GET",
			success: function (data){
				data = JSON.parse(data);
				//TODO onresults event handler
				filter(data);
			}
		});
	}

	function filter(data){
		//TODO more general
		var obj, firstNameDist, lastNameDist, userNameDist;
		for (var i = 0; i < data.length; i++){
			obj = {};
			obj.user = data[i];
			firstNameDist = getDistance(data[i].firstName, input);
			lastNameDist = getDistance(data[i].lastName, input);
			userNameDist = getDistance(data[i].userName, input);
			obj.distance = Math.min(firstNameDist, Math.min(lastNameDist, userNameDist));
			data[i] = obj;
		}
		//sort the results
		if (data.length > 1){
			cache = quicksort(data);
			displayDropdown(cache);
		}
		//display the results
		displayDropdown(data);
	}
	
	function displayDropdown(data){
		var items = createDropdownItems(data);
		for (var i = 0; i < items.length; i++){
			searchDropdown.appendChild(items[i]);
		}
		if (bold) turnLettersBold();
		openDropdown();
	}

	function turnLettersBold(){
		var letters = searchBox.value;
		if (!searchDropdown.hasChildNodes()) return;
		var children = searchDropdown.childNodes;
		var h, p;
		//TODO more general 
		for (var i = 0; i < children.length; i++){
			h = children[i].getElementsByTagName("h4");
			p = children[i].getElementsByTagName("p");
			if (h.length >= 1) lettersToBold(h[0], letters);
			if (p.length >= 1) lettersToBold(p[0], letters);
		}
	}

	function lettersToBold(element, letters){
		if (typeof letters !== 'string') return;
		if (!(element instanceof HTMLElement)) return;
		var s = document.createElement('span'), t = document.createElement('span');
		s.style.fontWeight = "bolder";
		//remove previous spans within the element
		var str = element.textContent;
		element.innerHTML = "";
		str = str.toLowerCase();
		letters = letters.toLowerCase();
		for (var i = letters.length; i > startAmount; i--){
			if (str.substring(0, i) == letters.substring(0, i)){
				s.textContent = str.substring(0, i);
				element.appendChild(s);
				t.textContent = str.substring(i);
				element.appendChild(t);
				break;
			}else if (i == startAmount + 1){
				t.textContent = str;
				element.appendChild(t);
			}
		}
		return element;
	}

	function clearDropdown(){//clears and closes the dropdown
		if (searchDropdown.hasChildNodes()){
			while(searchDropdown.firstChild){
				searchDropdown.removeChild(searchDropdown.firstChild);
			}
		}
		closeDropdown();
	}

	function closeDropdown(){
		searchDropdown.classList.remove('open');
	}

	function openDropdown(){
		searchDropdown.classList.add('open');
	}

	function getSelected(){
		if (searchDropdown.hasChildNodes()){
			var children = searchDropdown.childNodes;
			for (var i = 0; i < children.length; i++){
				if (children[i].style.backgroundColor == highlightColor){
					return children[i];
				}
			}
		}
	}

	function setSelected(element){
		element.style.backgroundColor = highlightColor;
	}

	function unSelectAllItems(){
		if (searchDropdown.hasChildNodes()){
			var children = searchDropdown.childNodes;
			for (var i = 0; i < children.length; i++){
				children[i].style.backgroundColor = "transparent";
			}
		}
	}

	function needsUpdate(data){
		if (cache.length <= 1 || cache[0].distance < 0.5) return true;
		return false;
	}

	function inputEvent(event){
		input = event.target.value;
		if (input.length > startAmount){
			if (needsUpdate(cache)) getSearchResults(input);
			if (cache.length > 1) cache = quicksort(cache);
			displayDropdown(cache);
		}else{
			clearDropdown();
		}
	}

	function blurEvent(event){
		console.log("onBlur");
		searchBox.value = "";
		clearDropdown();
	}

	function mouseEnterEvent(event){
		//remove any previously selected items
		unSelectAllItems();
		setSelected(event.target);
	}

	function mouseLeaveEvent(event){
		event.target.style.backgroundColor = "transparent";
	}

	function keyUpEvent(event){
		if (event.keyCode != '8') return;
		//backspace was hit
		if (input.length <= startAmount){
			clearDropdown();
		}
	}

	function keyDownEvent(event){
		var key = (typeof event.which === 'undefined') ? event.keyCode : event.which;
		if (typeof key === 'undefined') console.error("Cannot read keyCode");
		//if the key pressed was not the up or down arrow or enter then return
		if (key != '40' && key != '38' && key != '13') return;
		event.preventDefault(); //prevent default behavior of arrow key press
		event.stopPropagation();
		//find the current selected item by searching the ul for li with class .selected
		if (!searchDropdown.hasChildNodes()) return;
		var listItems = searchDropdown.childNodes;
		var selected = getSelected();
		var current;
		//remove items selected
		unSelectAllItems();
		
		switch(key){
		case ('40'):
			//down arrow was pressed
			if (typeof selected === 'undefined' || selected == searchDropdown.lastChild){
				current = listItems[0];
			}else{
				current = (selected.nextSibling !== 'null') ? selected.nextSibling : listItems[0];
			}		
			setSelected(current);
		break;
		case ('38'):
			//up arrow was pressed
			if (typeof selected === 'undefined' || selected == searchDropdown.firstChild){
				current = listItems[listItems.length - 1];
			}else{
				current = (selected.previousSibling !== 'null') ? selected.previousSibling : listItems[listItems.length - 1];
			}
			setSelected(current);
		break;
		case ('13'):
			//enter key was pressed
			var gS = getSelected();
			if (typeof gS !== 'undefined') gS.click();
		break;
		}
		
	}

	function getDistance(a, b){
		//Levenshtein Distance between two strings
		if(a.length === 0) return b.length;
		if(b.length === 0) return a.length;
		
		var matrix = [];
		
		//each row of the first column
		var i;
		for(i = 0; i <= b.length; i++){
			matrix[i] = [i];
		}
		
		//each column in the first row
		var j;
		for(j = 0; j <= a.length; j++){
			matrix[0][j] = j;
		}
		
		//fill in the rest of the matrix, the last value of the matrix, matrix[b.length][a.length] will hold the distance value
		for(i = 1; i <= b.length; i++){
			for(j = 1; j <= a.length; j++){
				if(b.charAt(i - 1) == a.charAt(j - 1)){
					matrix[i][j] = matrix[i - 1][j - 1];
				}else{
					matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, //substitution
											Math.min(matrix[i][j - 1] + 1, //insertion
													matrix[i - 1][j] + 1)); //deletion
				}
			}
		}
		return matrix[b.length][a.length];
	}

	function quicksort(arr){
		if (arr.length === 0){
			return [];
		}
		var left = [], right = [], pivot = arr[0];
		for (var i = 1; i < arr.length; i++){
			if (arr[i].distance < pivot.distance){
				left.push(arr[i]);
			}else{
				right.push(arr[i]);
			}
		}
		
		return quicksort(left).concat(pivot, quicksort(right));
	}
	
	
	
	var returnObject = {
			//public methods
			remoteSource: "remoteSource(source)",
			localSource: "localSource(source)",
			setMinCharacters: "setMinCharacters(amount)",
			customize: "customize(element)",
			setHighlightColor: "setHighlightColor(color)",
			showBold: "showBold(bool)"
	};
	
	return returnObject;
	
})(element);