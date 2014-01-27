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
		@days = (@buildDay day_element for day_element in document.querySelectorAll(".week .day"))
		@somedays = (@buildDay day_element for day_element in document.querySelectorAll(".someday"))		

		document.addEventListener("keyup", @handleEnterKey, false)
		document.getElementById("previous").addEventListener("click", @handlePrevClick, false)
		document.getElementById("next").addEventListener("click", @handleNextClick, false)		

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
			
			if task_date?
				task_object = {task_text: task, due_date: task_date}								
			else
				task_column = app.activeInput.object.element.parentElement.id 
				task_column = task_column.substring(8);
				console.log(task_column)
				task_object = {task_text: task, someday_column: task_column}												

		    # send to server
			app.activeInput.object.addTask(task_object)
	
	handlePrevClick: (e) ->
		console.log(app.days[0])
		console.log(new Date(app.days[0].date - 1000*60*60*24));
		date = 	new Date(app.days[0].date - 1000*60*60*24);
		
		app.getDay(date)
		
	handleNextClick: (e) ->
		# console.log(app.days[0])
		# console.log(new Date(app.days[0].date - 1000*60*60*24));
		console.log app.days[6].date
		date = 	new Date(app.days[6].date.valueOf() + 1000*60*60*25);
		console.log("next date:" + date)
		app.getDay(date)		
		
			
	getDay: (date) ->
		
		
		#Manage CSS for the already displayed days
		#If previous days hidden by css, show them.
		
		#Otherwise, grab day from server
		
		#Returned HTML
		#Prepend or append to Week
		#day = new TaskDay(new_element)
		

		# escape(date)
		# encodeURIComponent()
		# @days.unshift(day)
		#if previous day
			#day.disable()
			#remove extra
		
		
		if date < new Date()
			console.log("previous")
			forward = false
		else
			console.log("next")
			forward = true
		
			
		xhr = new XMLHttpRequest();		

		if date.getMonth() < 9
			month_string = "0" + (date.getMonth() + 1)
		else
			month_string = date.getMonth() + 1
		
		
		if date.getDate() < 10
			day_string = "0" + date.getDate()
		else
			day_string = date.getDate()
			
		# day_string = "0" + date.getDate().toString if date.getDate() < 10 else date.getDate()
		# month_string = "0" + date.getMonth().toString if date.getMonth() < 10 else date.getMonth()		
		
		xhr.open("GET", "/todo/day/"+date.getFullYear()+month_string+day_string, true)		
		# xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		xhr.onload = (e) ->
			if @status is 200
				console.log(@response)
				#@response is HTML for day
				if forward
					# app.days[0].remove()
					app.days.shift().remove()
			
					week = document.querySelector(".week")
			
					temp_wrapper = document.createElement("div")
					temp_wrapper.innerHTML = @response
					day = new TaskDay(temp_wrapper.children[0])
					# day.disable()
			
					week.appendChild(day.element)
			
					app.days.push(day)
				
				else
					
					# app.days[app.days.length - 1].remove()					
					app.days[6].remove()										
					app.days.pop()
			
					
			
					week = document.querySelector(".week")
			
					# week.lastElementChild.remove()
			
			
					temp_wrapper = document.createElement("div")
					temp_wrapper.innerHTML = @response
					day = new TaskDay(temp_wrapper.children[0])
					day.disable()
			
					week.insertBefore(day.element, app.days[0].element)
			
					app.days.unshift(day)
				

		xhr.send()


class TaskDay
	constructor: (element) ->
		# element.parent.removeChild(element)
		@element = element
		# @element.classList.add("dnone")
		@tasklist = new TaskList(@element.querySelector(".tasklist"));
		# 2012-09-29 00:00:00  -- 19
		# temp_date = @tasklist.input.getAttribute("data-date");
		@date = new Date(@tasklist.input.getAttribute("data-js-date"););
		console.log("@date: " + @date);
		@element.object = @
		

	remove: () ->
		#TODO: Dirty check before removal
		console.log(@element)
		@element.parentElement.removeChild(@element)	
		# @element.parent.removeChild(@element)

	disable: () -> 
		@element.classList.add("disabled")
		console.log("Disabling Task List")
		@tasklist.input.disabled = true;
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
		task.build(object.task_text)

		spinner = new Spinner();

		task.element.appendChild(spinner.element);
		@input.value = "";
		app.updatePageTitle(true)

		xhr = new XMLHttpRequest();
		xhr.open("POST", "/todo/", true)		
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		xhr.onload = (e) ->
			if @status is 200
				console.log(@response)
				obj = JSON.parse(@response)
				if obj.success 
					app.outputToConsole("task added")
					task.set_id(obj.id)
					spinner.remove()

		if object.due_date?
			request_string = "task_text=" + object.task_text + "&due_date=" + object.due_date.toString()
		else 
			request_string = "task_text=" + object.task_text + "&someday_column=" + object.someday_column
		
		console.log(request_string)
		xhr.send(request_string.replace(/\s/g, "+"))

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
		@element.innerHTML = "<span class='label'>" + text.substring(0, text.indexOf(":")+1) + "</span>" + text.substring(text.indexOf(":")+1)
		
	set_id: (id) ->
		@element.setAttribute("data-id", id);
		@id = id;		
	
	toggle: () ->
		if @completed
			@uncomplete()
		else
			@complete()
			
		@completed = @element.classList.contains("completed")			

	complete: () ->
		@element.classList.add("completed")
		app.updatePageTitle(false);

		xhr = new XMLHttpRequest();
		xhr.open("POST", "/todo/#{@id}", true)		

		xhr.onload = (e) ->
			if @status is 200
				obj = JSON.parse(@response)
				if obj.success 
					app.outputToConsole("task completed")
		
		xhr.send()		
	
	uncomplete: () ->
		@element.classList.remove("completed")
		app.updatePageTitle(true);

		xhr = new XMLHttpRequest();
		xhr.open("POST", "/todo/#{@id}", true)		

		xhr.onload = (e) ->
			if @status is 200
				obj = JSON.parse(@response)
				if obj.success 
					app.outputToConsole("task uncompleted")
		
		xhr.send()
							
	
##Page Load Items	
app = new TodoApp();
app.setCurrentDay();
