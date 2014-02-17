// Generated by CoffeeScript 1.7.1
(function() {
  /* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-teststyles-prefixes
 */
;window.Modernizr=function(a,b,c){function v(a){i.cssText=a}function w(a,b){return v(l.join(a+";")+(b||""))}function x(a,b){return typeof a===b}function y(a,b){return!!~(""+a).indexOf(b)}function z(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:x(f,"function")?f.bind(d||b):f}return!1}var d="2.5.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m={},n={},o={},p=[],q=p.slice,r,s=function(a,c,d,e){var h,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),k.appendChild(j);return h=["&#173;","<style>",a,"</style>"].join(""),k.id=g,(l?k:m).innerHTML+=h,m.appendChild(k),l||(m.style.background="",f.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},t={}.hasOwnProperty,u;!x(t,"undefined")&&!x(t.call,"undefined")?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e});var A=function(c,d){var f=c.join(""),g=d.length;s(f,function(c,d){var f=b.styleSheets[b.styleSheets.length-1],h=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"",i=c.childNodes,j={};while(g--)j[i[g].id]=i[g];e.touch="ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch||(j.touch&&j.touch.offsetTop)===9},g,d)}([,["@media (",l.join("touch-enabled),("),g,")","{#touch{top:9px;position:absolute}}"].join("")],[,"touch"]);m.touch=function(){return e.touch};for(var B in m)u(m,B)&&(r=B.toLowerCase(),e[r]=m[B](),p.push((e[r]?"":"no-")+r));return v(""),h=j=null,e._version=d,e._prefixes=l,e.testStyles=s,e}(this,this.document);;
  var Spinner, Task, TaskDay, TaskList, TodoApp, addTouchClickEventListener, animateSpinner, app, removeTouchClickEventListener;

  animateSpinner = function() {
    var frames, i, spinnerFrame;
    i = 0;
    frames = ["/", "|", "\\", "-"];
    spinnerFrame = function() {
      document.getElementById("spinner").innerHTML = frames[i];
      i = i < 3 ? i + 1 : 0;
      i;
      return window.requestAnimationFrame(spinnerFrame);
    };
    return window.requestAnimationFrame(spinnerFrame);
  };

  addTouchClickEventListener = function(element, func) {
    if (Modernizr.touch) {
      return element.addEventListener("touchend", func, false);
    } else {
      return element.addEventListener("click", func, false);
    }
  };

  removeTouchClickEventListener = function(element, func) {
    if (Modernizr.touch) {
      return element.removeEventListener("touchend", func, false);
    } else {
      return element.removeEventListener("click", func, false);
    }
  };

  Spinner = (function() {
    function Spinner() {
      this.element = document.createElement("div");
      this.element.innerHTML = "~";
      this.element.classList.add("processspinner");
    }

    Spinner.prototype.remove = function() {
      return this.element.parentElement.removeChild(this.element);
    };

    return Spinner;

  })();

  TodoApp = (function() {
    function TodoApp() {
      var day_element;
      this.console = document.querySelector(".console");
      this.days = (function() {
        var _i, _len, _ref, _results;
        _ref = document.querySelectorAll(".week .day");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          day_element = _ref[_i];
          _results.push(this.buildDay(day_element));
        }
        return _results;
      }).call(this);
      this.somedays = (function() {
        var _i, _len, _ref, _results;
        _ref = document.querySelectorAll(".someday");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          day_element = _ref[_i];
          _results.push(this.buildDay(day_element));
        }
        return _results;
      }).call(this);
      document.addEventListener("keyup", this.handleEnterKey, false);
      document.getElementById("previous").addEventListener("click", this.handlePrevClick, false);
      document.getElementById("next").addEventListener("click", this.handleNextClick, false);
    }

    TodoApp.prototype.buildDay = function(element) {
      return new TaskDay(element);
    };

    TodoApp.prototype.outputToConsole = function(message) {
      var newconsoleline;
      newconsoleline = document.createElement("p");
      newconsoleline.innerHTML = message;
      this.console.appendChild(newconsoleline);
      return true;
    };

    TodoApp.prototype.setCurrentDay = function() {
      var day, day_num, i, today, _i, _len, _ref;
      today = new Date();
      day_num = today.getDay();
      this.activeInput = document.querySelectorAll(".task_entry")[day_num];
      this.activeInput.focus();
      _ref = this.days;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        day = _ref[i];
        if (i < day_num) {
          day.disable();
        }
      }
      if (window.innerWidth <= 600) {
        console.log(this.days[day_num].element.offsetTop);
        return setTimeout(function() {
          return window.scroll(0, app.days[day_num].element.offsetTop);
        }, 10);
      }
    };

    TodoApp.prototype.updatePageTitle = function(up) {
      var taskcount, _ref, _ref1;
      if (up) {
        setTaskCount(1);
      } else {
        setTaskCount(-1);
      }
      taskcount = getTaskCount();
      if (taskcount > 1) {
        document.title = taskcount + " tasks :: todo.designedbyscience.com";
        return (_ref = window.fluid) != null ? _ref.dockBadge = taskcount + "" : void 0;
      } else {
        document.title = taskcount + " task :: todo.designedbyscience.com";
        return (_ref1 = window.fluid) != null ? _ref1.dockBadge = taskcount + "" : void 0;
      }
    };

    TodoApp.prototype.handleEnterKey = function(e) {
      var task, task_column, task_date, task_object;
      if (e.keyCode === 13) {
        task = app.activeInput.value;
        task_date = app.activeInput.getAttribute("data-date");
        if (task_date != null) {
          task_object = {
            task_text: task,
            due_date: task_date
          };
        } else {
          task_column = app.activeInput.object.element.parentElement.id;
          task_column = task_column.substring(8);
          console.log(task_column);
          task_object = {
            task_text: task,
            someday_column: task_column
          };
        }
        return app.activeInput.object.addTask(task_object);
      }
    };

    TodoApp.prototype.handlePrevClick = function(e) {
      var date;
      console.log(app.days[0]);
      console.log(new Date(app.days[0].date - 1000 * 60 * 60 * 24));
      date = new Date(app.days[0].date - 1000 * 60 * 60 * 24);
      return app.getDay(date);
    };

    TodoApp.prototype.handleNextClick = function(e) {
      var date;
      console.log(app.days[6].date);
      date = new Date(app.days[6].date.valueOf() + 1000 * 60 * 60 * 25);
      console.log("next date:" + date);
      return app.getDay(date);
    };

    TodoApp.prototype.getDay = function(date) {
      var day_string, forward, month_string, xhr;
      if (date < new Date()) {
        console.log("previous");
        forward = false;
      } else {
        console.log("next");
        forward = true;
      }
      xhr = new XMLHttpRequest();
      if (date.getMonth() < 9) {
        month_string = "0" + (date.getMonth() + 1);
      } else {
        month_string = date.getMonth() + 1;
      }
      if (date.getDate() < 10) {
        day_string = "0" + date.getDate();
      } else {
        day_string = date.getDate();
      }
      xhr.open("GET", "/todo/day/" + date.getFullYear() + month_string + day_string, true);
      xhr.onload = function(e) {
        var day, temp_wrapper, week;
        if (this.status === 200) {
          console.log(this.response);
          if (forward) {
            app.days.shift().remove();
            week = document.querySelector(".week");
            temp_wrapper = document.createElement("div");
            temp_wrapper.innerHTML = this.response;
            day = new TaskDay(temp_wrapper.children[0]);
            week.appendChild(day.element);
            return app.days.push(day);
          } else {
            app.days[6].remove();
            app.days.pop();
            week = document.querySelector(".week");
            temp_wrapper = document.createElement("div");
            temp_wrapper.innerHTML = this.response;
            day = new TaskDay(temp_wrapper.children[0]);
            day.disable();
            week.insertBefore(day.element, app.days[0].element);
            return app.days.unshift(day);
          }
        }
      };
      return xhr.send();
    };

    return TodoApp;

  })();

  TaskDay = (function() {
    function TaskDay(element) {
      this.element = element;
      this.tasklist = new TaskList(this.element.querySelector(".tasklist"));
      this.date = new Date(this.tasklist.input.getAttribute("data-js-date"));
      console.log("@date: " + this.date);
      this.element.object = this;
    }

    TaskDay.prototype.remove = function() {
      console.log(this.element);
      return this.element.parentElement.removeChild(this.element);
    };

    TaskDay.prototype.disable = function() {
      this.element.classList.add("disabled");
      console.log("Disabling Task List");
      this.tasklist.input.disabled = true;
      return removeTouchClickEventListener(this.tasklist.element, this.tasklist.handleClick);
    };

    return TaskDay;

  })();

  TaskList = (function() {
    function TaskList(element) {
      this.element = element;
      this.element.object = this;
      this.tasks = this.buildTasks();
      this.input = this.element.querySelector("input");
      this.input.object = this;
      addTouchClickEventListener(this.element, this.handleClick);
      this.input.addEventListener("focus", this.handleFocus, false);
    }

    TaskList.prototype.handleFocus = function(e) {
      return app.activeInput = this;
    };

    TaskList.prototype.buildTasks = function() {
      var el, tasks;
      tasks = [];
      return tasks = (function() {
        var _i, _len, _ref, _results;
        _ref = this.element.querySelectorAll(".task");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          if (!el.classList.contains("empty")) {
            _results.push(new Task(el));
          }
        }
        return _results;
      }).call(this);
    };

    TaskList.prototype.handleClick = function(e) {
      var task;
      if (e.target.classList.contains("task") && !e.target.classList.contains("empty")) {
        task = e.target.object;
        return task.toggle();
      }
    };

    TaskList.prototype.findTask = function(id) {
      var task;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = this.tasks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          if (task.id === id) {
            _results.push(task);
          }
        }
        return _results;
      }).call(this))[0];
    };

    TaskList.prototype.addTask = function(object) {
      var new_task_element, request_string, spinner, task, xhr;
      app.outputToConsole("Sending task...");
      new_task_element = this.element.querySelector(".empty");
      if (!new_task_element) {
        new_task_element = Task.buildElement();
        this.element.appendChild(new_task_element);
      }
      task = new Task(new_task_element);
      task.build(object.task_text);
      spinner = new Spinner();
      task.element.appendChild(spinner.element);
      this.input.value = "";
      app.updatePageTitle(true);
      xhr = new XMLHttpRequest();
      xhr.open("POST", "/todo/", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function(e) {
        var obj;
        if (this.status === 200) {
          console.log(this.response);
          obj = JSON.parse(this.response);
          if (obj.success) {
            app.outputToConsole("task added");
            task.set_id(obj.id);
            return spinner.remove();
          }
        }
      };
      if (object.due_date != null) {
        request_string = "task_text=" + object.task_text + "&due_date=" + object.due_date.toString();
      } else {
        request_string = "task_text=" + object.task_text + "&someday_column=" + object.someday_column;
      }
      console.log(request_string);
      xhr.send(request_string.replace(/\s/g, "+"));
      return true;
    };

    return TaskList;

  })();

  Task = (function() {
    Task.buildElement = function() {
      var element;
      element = document.createElement("div");
      element.classList.add("task");
      return element;
    };

    function Task(element) {
      this.element = element;
      this.element.object = this;
      this.completed = this.element.classList.contains("completed");
      this.id = this.element.getAttribute("data-id");
    }

    Task.prototype.build = function(text) {
      this.element.classList.add("processing");
      this.element.classList.remove("empty");
      return this.element.innerHTML = "<span class='label'>" + text.substring(0, text.indexOf(":") + 1) + "</span>" + text.substring(text.indexOf(":") + 1);
    };

    Task.prototype.set_id = function(id) {
      this.element.setAttribute("data-id", id);
      return this.id = id;
    };

    Task.prototype.toggle = function() {
      if (this.completed) {
        this.uncomplete();
      } else {
        this.complete();
      }
      return this.completed = this.element.classList.contains("completed");
    };

    Task.prototype.complete = function() {
      var xhr;
      this.element.classList.add("completed");
      app.updatePageTitle(false);
      xhr = new XMLHttpRequest();
      xhr.open("POST", "/todo/" + this.id, true);
      xhr.onload = function(e) {
        var obj;
        if (this.status === 200) {
          obj = JSON.parse(this.response);
          if (obj.success) {
            return app.outputToConsole("task completed");
          }
        }
      };
      return xhr.send();
    };

    Task.prototype.uncomplete = function() {
      var xhr;
      this.element.classList.remove("completed");
      app.updatePageTitle(true);
      xhr = new XMLHttpRequest();
      xhr.open("POST", "/todo/" + this.id, true);
      xhr.onload = function(e) {
        var obj;
        if (this.status === 200) {
          obj = JSON.parse(this.response);
          if (obj.success) {
            return app.outputToConsole("task uncompleted");
          }
        }
      };
      return xhr.send();
    };

    return Task;

  })();

  app = new TodoApp();

  app.setCurrentDay();

}).call(this);
