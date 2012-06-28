
##UI Functions
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

setDisabled = (tl) -> 
	tl.classList.add("disabled")
	#tl.children[0].setAttribute()

setCurrentDay = () ->
	today = new Date();
	
	if today.getDay() == 0
		activeInput = document.querySelectorAll(".task_entry")[0]
	else
		activeInput = document.querySelectorAll(".task_entry")[today.getDay()-1]
	
	activeInput.focus()
	
	tasklists = document.querySelectorAll(".day")	
	#setTasklistDisabled tasklist for tasklist in .splice(0, today.getDay())
	for tasklist, i in document.querySelectorAll(".day") when i < today.getDay()-1
		console.log(i)
		setDisabled(tasklist)
		

#Task management functions
	
addTask = (object, list) ->
	outputToConsole("Sending task...")	
	newtask = list.querySelector(".empty")
	newtask.classList.add("processing")
	newtask.classList.remove("empty")		
	newtask.innerHTML = object.task_text
	addProcessingSpinner(newtask)
	clearActiveInput();
	
	$.ajax({
		url: "/todo/"
		type: "POST"
		data: object
		success: (data, textStatus, jqXHR) ->
			outputToConsole("task added")
			removeProcessingSpinner(newtask)
	})
	
	true


completeTask = (task) ->
	task.classList.add("completed")
	id = task.getAttribute("data-id")
	$.ajax({
		url: "/todo/#{id}" 
		type: "POST"
		success: (data, textStatus, jqXHR) ->
			outputToConsole("task removed")
	})

uncompleteTask = (task) ->
	task.classList.remove("completed")
	id = task.getAttribute("data-id")
	$.ajax({
		url: "/todo/#{id}" 
		type: "POST"
		success: (data, textStatus, jqXHR) ->
			outputToConsole("task removed")
	})

handleTaskListClick = (e) ->
	if e.target.classList.contains("task") && !e.target.classList.contains("empty")
		if e.target.classList.contains("completed")
			uncompleteTask(e.target)
		else
			completeTask(e.target)	

addTaskListClickListener = (o) ->
	o.addEventListener("click", handleTaskListClick, false)

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

animateSpinner();
setCurrentDay();

document.addEventListener("keyup", handleEnterKey, false)

addFocusListener input for input in document.querySelectorAll(".task_entry")
addTaskListClickListener input for input in document.querySelectorAll(".tasklist")
	
	