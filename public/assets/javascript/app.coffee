`/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-teststyles-prefixes
 */
;window.Modernizr=function(a,b,c){function v(a){i.cssText=a}function w(a,b){return v(l.join(a+";")+(b||""))}function x(a,b){return typeof a===b}function y(a,b){return!!~(""+a).indexOf(b)}function z(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:x(f,"function")?f.bind(d||b):f}return!1}var d="2.5.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m={},n={},o={},p=[],q=p.slice,r,s=function(a,c,d,e){var h,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),k.appendChild(j);return h=["&#173;","<style>",a,"</style>"].join(""),k.id=g,(l?k:m).innerHTML+=h,m.appendChild(k),l||(m.style.background="",f.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},t={}.hasOwnProperty,u;!x(t,"undefined")&&!x(t.call,"undefined")?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e});var A=function(c,d){var f=c.join(""),g=d.length;s(f,function(c,d){var f=b.styleSheets[b.styleSheets.length-1],h=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"",i=c.childNodes,j={};while(g--)j[i[g].id]=i[g];e.touch="ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch||(j.touch&&j.touch.offsetTop)===9},g,d)}([,["@media (",l.join("touch-enabled),("),g,")","{#touch{top:9px;position:absolute}}"].join("")],[,"touch"]);m.touch=function(){return e.touch};for(var B in m)u(m,B)&&(r=B.toLowerCase(),e[r]=m[B](),p.push((e[r]?"":"no-")+r));return v(""),h=j=null,e._version=d,e._prefixes=l,e.testStyles=s,e}(this,this.document);`


animateSpinner = () ->
	i = 0
	frames = ["/", "|", "\\", "-"]

	setInterval(() ->
		document.getElementById("spinner").innerHTML = frames[i];
		i = if i<3 then i+1 else 0
		(i)
	, 100)

##Convienence Functions

#Function to set Touch events on appropriate devices
addTouchClickEventListener = (element, func) ->
	# If touch, 
	if Modernizr.touch
		element.addEventListener("touchend", func, false);
	else
		element.addEventListener("click", func, false);

removeTouchClickEventListener = (element, func) ->
	# If touch, 	
	if Modernizr.touch
		element.removeEventListener("touchend", func, false);
	else
		element.removeEventListener("click", func, false);
			
class Spinner
	constructor: () ->
		@element = document.createElement("div")
		@element.innerHTML = "~"
		@element.classList.add("processspinner")
	
	remove: ()->
		@element.parentElement.removeChild(@element)	

class TodoApp
	constructor: () ->
		@console = document.querySelector(".console")
		@days = (@buildDay day_element for day_element in document.querySelectorAll(".day"))

		document.addEventListener("keyup", @handleEnterKey, false)

	buildDay: (element) ->
		new TaskDay(element);
		
	outputToConsole: (message) ->
		newconsoleline = document.createElement("p");
		newconsoleline.innerHTML = message;
		@console.appendChild(newconsoleline);
		true
	
	setCurrentDay: () ->
		today = new Date();
		day_num = today.getDay();
		@activeInput = document.querySelectorAll(".task_entry")[day_num]
		@activeInput.focus()
		day.disable() for day, i in @days when i < day_num;
		
		if window.innerWidth <= 600
			console.log(@days[day_num].element.offsetTop)
			setTimeout( () -> 
				window.scroll(0, app.days[day_num].element.offsetTop)
	
			, 10)

	
		
	
	
	updatePageTitle: (up) ->
		# setTaskCount and getTaskCount currently live on the page as functions, above this scope
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

	handleEnterKey: (e) ->
		if e.keyCode is 13
			# find active task entry
			task = app.activeInput.value
			
			task_date = app.activeInput.getAttribute("data-date");
			task_object = {task_text: task, due_date: task_date}
		    # send to server
			app.activeInput.object.addTask(task_object)


class TaskDay
	constructor: (@element) ->
		@tasklist = new TaskList(@element.querySelector(".tasklist"));
		@element.object = @

	disable: () -> 
		@element.classList.add("disabled")
		console.log("Disabling Task List")
		@tasklist.input.setAttribute("disabled");
		# @tasklist.element.removeEventListener("click", @tasklist.handleClick, false)
		removeTouchClickEventListener(@tasklist.element,@tasklist.handleClick);

class TaskList
	constructor: (@element) ->
		@element.object = @
		@tasks = @buildTasks();
		@input = @element.querySelector("input");
		@input.object = @

		addTouchClickEventListener(@element, @handleClick)
		@input.addEventListener("focus", @handleFocus, false);
		
	handleFocus: (e) ->
		app.activeInput = this;				
		
	buildTasks: () ->
		tasks = [];
		tasks = (new Task(el) for el in @element.querySelectorAll(".task") when not el.classList.contains("empty"))
		
	handleClick: (e) ->
		if e.target.classList.contains("task") && !e.target.classList.contains("empty")
			#Find task
			task = e.target.object
			task.toggle();

	findTask: (id) ->
		(task for task in @tasks when task.id is id)[0]

	addTask: (object) ->
		app.outputToConsole("Sending task...")	
		new_task_element = @element.querySelector(".empty")
		unless new_task_element
			new_task_element = Task.buildElement()
			@element.appendChild(new_task_element)

		task = new Task(new_task_element)
		task.build(object.tast_text)

		spinner = new Spinner();

		task.element.appendChild(spinner.element);
		@input.value = "";
		app.updatePageTitle(true)

		$.ajax({
			url: "/todo/"
			type: "POST"
			data: object
			success: (data, textStatus, jqXHR) ->
				json = $.parseJSON(data);
				app.outputToConsole("task added")
				task.set_id(json.id)
				spinner.remove()
		})

		true
			
class Task
	
	@buildElement: () ->
		element = document.createElement("div")
		element.classList.add("task")
		(element)
		
	constructor: (@element) ->
		@element.object = @
		@completed = @element.classList.contains("completed")
		@id = @element.getAttribute("data-id");
	
	build: (text) ->
		@element.classList.add("processing")
		@element.classList.remove("empty")		
		@element.innerHTML = text
		
	set_id: (id) ->
		@element.setAttribute("data-id", json.id);
		@id = json.id;		
	
	toggle: () ->
		if @completed
			@uncomplete()
		else
			@complete()
			
		@completed = @element.classList.contains("completed")			

	complete: () ->
		@element.classList.add("completed")
		app.updatePageTitle(false);

		$.ajax({
			url: "/todo/#{@id}" 
			type: "POST"
			success: (data, textStatus, jqXHR) ->
				app.outputToConsole("task completed")
		})
	
	uncomplete: () ->
		@element.classList.remove("completed")
		app.updatePageTitle(true);
					
		$.ajax({
			url: "/todo/#{@id}" 
			type: "POST"
			success: (data, textStatus, jqXHR) ->
				app.outputToConsole("task uncompleted")
		})
	
##Page Load Items	
app = new TodoApp();
app.setCurrentDay();
