// Generated by CoffeeScript 1.3.3
(function() {
  var activeInput, addFocusListener, addProcessingSpinner, addTask, addTaskListClickListener, animateSpinner, clearActiveInput, completeTask, handleEnterKey, handleInputFocus, handleTaskListClick, input, myconsole, outputToConsole, removeProcessingSpinner, setCurrentDay, setDisabled, setTaskFocus, uncompleteTask, updatePageTitle, _i, _j, _len, _len1, _ref, _ref1;

  updatePageTitle = function(up) {
    var taskcount;
    if (up) {
      setTaskCount(1);
    } else {
      setTaskCount(-1);
    }
    taskcount = getTaskCount();
    if (taskcount > 1) {
      return document.title = taskcount + " tasks :: todo.designedbyscience.com";
    } else {
      return document.title = taskcount + " task :: todo.designedbyscience.com";
    }
  };

  animateSpinner = function() {
    var frames, i;
    i = 0;
    frames = ["/", "|", "\\", "-"];
    return setInterval(function() {
      document.getElementById("spinner").innerHTML = frames[i];
      return i = i < 3 ? i + 1 : 0;
    }, 100);
  };

  setTaskFocus = function() {
    return document.querySelector(".task_entry").focus();
  };

  activeInput = document.querySelector(".task_entry");

  handleInputFocus = function(e) {
    return activeInput = e.target;
  };

  addFocusListener = function(o) {
    return o.addEventListener("focus", handleInputFocus, false);
  };

  clearActiveInput = function() {
    return activeInput.value = "";
  };

  addProcessingSpinner = function(element) {
    var spinner;
    spinner = document.createElement("div");
    spinner.innerHTML = "~";
    spinner.classList.add("processspinner");
    return element.appendChild(spinner);
  };

  removeProcessingSpinner = function(element) {
    var spinner;
    spinner = element.querySelector(".processspinner");
    element.removeChild(spinner);
    return element.classList.remove("processing");
  };

  setDisabled = function(tl) {
    return tl.classList.add("disabled");
  };

  setCurrentDay = function() {
    var i, tasklist, tasklists, today, _i, _len, _ref, _results;
    today = new Date();
    if (today.getDay() === 0) {
      activeInput = document.querySelectorAll(".task_entry")[0];
    } else {
      activeInput = document.querySelectorAll(".task_entry")[today.getDay() - 1];
    }
    activeInput.focus();
    tasklists = document.querySelectorAll(".day");
    _ref = document.querySelectorAll(".day");
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      tasklist = _ref[i];
      if (!(i < today.getDay() - 1)) {
        continue;
      }
      console.log(i);
      _results.push(setDisabled(tasklist));
    }
    return _results;
  };

  addTask = function(object, list) {
    var newtask;
    outputToConsole("Sending task...");
    newtask = list.querySelector(".empty");
    if (!newtask) {
      newtask = document.createElement("div");
      newtask.classList.add("task");
      list.appendChild(newtask);
    }
    newtask.classList.add("processing");
    newtask.classList.remove("empty");
    newtask.innerHTML = object.task_text;
    addProcessingSpinner(newtask);
    clearActiveInput();
    updatePageTitle(true);
    $.ajax({
      url: "/todo/",
      type: "POST",
      data: object,
      success: function(data, textStatus, jqXHR) {
        var json;
        json = $.parseJSON(data);
        outputToConsole("task added");
        newtask.setAttribute("data-id", json.id);
        return removeProcessingSpinner(newtask);
      }
    });
    return true;
  };

  completeTask = function(task) {
    var id;
    task.classList.add("completed");
    id = task.getAttribute("data-id");
    updatePageTitle(false);
    return $.ajax({
      url: "/todo/" + id,
      type: "POST",
      success: function(data, textStatus, jqXHR) {
        return outputToConsole("task completed");
      }
    });
  };

  uncompleteTask = function(task) {
    var id;
    task.classList.remove("completed");
    id = task.getAttribute("data-id");
    return $.ajax({
      url: "/todo/" + id,
      type: "POST",
      success: function(data, textStatus, jqXHR) {
        return outputToConsole("task uncompleted");
      }
    });
  };

  handleTaskListClick = function(e) {
    if (e.target.classList.contains("task") && !e.target.classList.contains("empty")) {
      if (e.target.classList.contains("completed")) {
        return uncompleteTask(e.target);
      } else {
        return completeTask(e.target);
      }
    }
  };

  addTaskListClickListener = function(o) {
    return o.addEventListener("click", handleTaskListClick, false);
  };

  handleEnterKey = function(e) {
    var task, task_date, task_object;
    if (e.keyCode === 13) {
      task = activeInput.value;
      task_date = activeInput.getAttribute("data-date");
      task_object = {
        task_text: task,
        due_date: task_date
      };
      return addTask(task_object, activeInput.parentNode);
    }
  };

  myconsole = document.querySelector(".console");

  outputToConsole = function(message) {
    var newconsoleline;
    newconsoleline = document.createElement("p");
    newconsoleline.innerHTML = message;
    myconsole.appendChild(newconsoleline);
    console.log(message);
    return true;
  };

  animateSpinner();

  setCurrentDay();

  document.addEventListener("keyup", handleEnterKey, false);

  _ref = document.querySelectorAll(".task_entry");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    input = _ref[_i];
    addFocusListener(input);
  }

  _ref1 = document.querySelectorAll(".tasklist");
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    input = _ref1[_j];
    addTaskListClickListener(input);
  }

}).call(this);
