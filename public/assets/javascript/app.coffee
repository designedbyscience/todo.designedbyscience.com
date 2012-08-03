`/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-teststyles-prefixes
 */
;window.Modernizr=function(a,b,c){function v(a){i.cssText=a}function w(a,b){return v(l.join(a+";")+(b||""))}function x(a,b){return typeof a===b}function y(a,b){return!!~(""+a).indexOf(b)}function z(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:x(f,"function")?f.bind(d||b):f}return!1}var d="2.5.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m={},n={},o={},p=[],q=p.slice,r,s=function(a,c,d,e){var h,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),k.appendChild(j);return h=["&#173;","<style>",a,"</style>"].join(""),k.id=g,(l?k:m).innerHTML+=h,m.appendChild(k),l||(m.style.background="",f.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},t={}.hasOwnProperty,u;!x(t,"undefined")&&!x(t.call,"undefined")?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e});var A=function(c,d){var f=c.join(""),g=d.length;s(f,function(c,d){var f=b.styleSheets[b.styleSheets.length-1],h=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"",i=c.childNodes,j={};while(g--)j[i[g].id]=i[g];e.touch="ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch||(j.touch&&j.touch.offsetTop)===9},g,d)}([,["@media (",l.join("touch-enabled),("),g,")","{#touch{top:9px;position:absolute}}"].join("")],[,"touch"]);m.touch=function(){return e.touch};for(var B in m)u(m,B)&&(r=B.toLowerCase(),e[r]=m[B](),p.push((e[r]?"":"no-")+r));return v(""),h=j=null,e._version=d,e._prefixes=l,e.testStyles=s,e}(this,this.document);`

##Convienence Functions

addTouchClickEventListener = (element, func) ->
	# If touch, 
	if Modernizr.touch
		element.addEventListener("touchend", func, false);
	else
		element.addEventListener("click", func, false);
	

##UI Functions
updatePageTitle = (up) ->
	if up
		setTaskCount(1)
	else
		setTaskCount(-1)

	taskcount = getTaskCount()
	if  taskcount > 1
		document.title = taskcount + " tasks :: todo.designedbyscience.com"
		window.fluid?.dockBadge = taskcount + ""
	else
		document.title = taskcount + " task :: todo.designedbyscience.com"
		window.fluid?.dockBadge = taskcount + ""		
		
# fluidDockIcon = (num) ->

			
animateSpinner = () ->
	i = 0
	frames = ["/", "|", "\\", "-"]
	
	setInterval(() ->
		document.getElementById("spinner").innerHTML = frames[i];
		i = if i<3 then i+1 else 0
	, 100)

setTaskFocus = () -> 
	document.querySelector(".task_entry").focus();	
	
activeInput	= document.querySelector(".task_entry");

handleInputFocus = (e) ->
	activeInput = e.target

addFocusListener = (o) ->
	o.addEventListener("focus", handleInputFocus, false)
	
clearActiveInput = () ->
	activeInput.value = ""

addProcessingSpinner = (element) ->
	spinner = document.createElement("div")
	spinner.innerHTML = "~"
	spinner.classList.add("processspinner")
	element.appendChild(spinner)	

removeProcessingSpinner = (element) ->
	spinner = element.querySelector(".processspinner")
	element.removeChild(spinner)
	element.classList.remove("processing")

setDisabled = (tl) -> 
	tl.classList.add("disabled")
	#tl.children[0].setAttribute()

setCurrentDay = () ->
	today = new Date();
	
	activeInput = document.querySelectorAll(".task_entry")[today.getDay()]
	
	activeInput.focus()
	
	tasklists = document.querySelectorAll(".day")	
	#setTasklistDisabled tasklist for tasklist in .splice(0, today.getDay())
	for tasklist, i in document.querySelectorAll(".day") when i < today.getDay()
		console.log(i)
		setDisabled(tasklist)
		

#Task management functions
	
addTask = (object, list) ->
	outputToConsole("Sending task...")	
	newtask = list.querySelector(".empty")
	unless newtask
		newtask = document.createElement("div")
		newtask.classList.add("task")
		list.appendChild(newtask)
		
	newtask.classList.add("processing")
	newtask.classList.remove("empty")		
	newtask.innerHTML = object.task_text
	addProcessingSpinner(newtask)
	clearActiveInput();
	updatePageTitle(true)
	
	$.ajax({
		url: "/todo/"
		type: "POST"
		data: object
		success: (data, textStatus, jqXHR) ->
			json = $.parseJSON(data);
			outputToConsole("task added")
			newtask.setAttribute("data-id", json.id);
			removeProcessingSpinner(newtask)
	})
	
	true


completeTask = (task) ->
	task.classList.add("completed")
	id = task.getAttribute("data-id")
	updatePageTitle(false)
	
	$.ajax({
		url: "/todo/#{id}" 
		type: "POST"
		success: (data, textStatus, jqXHR) ->
			outputToConsole("task completed")
	})

uncompleteTask = (task) ->
	task.classList.remove("completed")
	id = task.getAttribute("data-id")
	$.ajax({
		url: "/todo/#{id}" 
		type: "POST"
		success: (data, textStatus, jqXHR) ->
			outputToConsole("task uncompleted")
	})

handleTaskListClick = (e) ->
	if e.target.classList.contains("task") && !e.target.classList.contains("empty")
		if e.target.classList.contains("completed")
			uncompleteTask(e.target)
		else
			completeTask(e.target)	

addTaskListClickListener = (o) ->
	addTouchClickEventListener(o, handleTaskListClick)
	# o.addEventListener("click", handleTaskListClick, false)

handleEnterKey = (e) ->
	if e.keyCode is 13
		# find active task entry
		task = activeInput.value
		task_date = activeInput.getAttribute("data-date");
		task_object = {task_text: task, due_date: task_date}
	    # send to server
		addTask(task_object, activeInput.parentNode)

myconsole = document.querySelector(".console");
outputToConsole = (message) ->
	newconsoleline = document.createElement("p");
	newconsoleline.innerHTML = message;
	myconsole.appendChild(newconsoleline);
	console.log(message)
	true
	
	
##Page Load Items	

#animateSpinner();
setCurrentDay();

document.addEventListener("keyup", handleEnterKey, false)

addFocusListener input for input in document.querySelectorAll(".task_entry")
addTaskListClickListener input for input in document.querySelectorAll(".tasklist")
	
	