function Helper(allowRun){
  allowRun = allowRun || false;
  var helper = document.getElementsByClassName('help')[0];
  var closer = document.getElementsByClassName('close')[0];
  var canRuns = document.getElementsByClassName('can-run');
  var justEdits = document.querySelectorAll('[contenteditable]');

  var helperMethods = Object.create(null);

  helperMethods.open = open;
  helperMethods.close = close;

  if(allowRun) {
    helperMethods.runner = runner;
    helperMethods.reset = init;
  }

  init();

  console.log('Type "robot." here to get started!');
  return helperMethods;

  function init(){
    _.each(justEdits, function(editElement){
      editElement.onclick = stopEvent;
      editElement.onfocus = selectOnFocus;
      editElement.onblur = deselect;
      editElement.onkeydown = preventEvent;
    });

    _.each(canRuns, function(codeElement){
      codeElement.onclick = selectElementContents.bind(null, codeElement);
    });

    return 'Helper started.'
  }


  function runner(){
    _.each(justEdits, function(editElement){
      editElement.onclick = stopEvent;
      editElement.onfocus = selectOnFocus;
      editElement.onblur = deselect;
      editElement.onkeydown = runCodeOnEnter;
    });

    _.each(canRuns, function(codeElement){
      codeElement.onclick = runCodeOnClick;
    });

    return 'Click on code to run.';
  }


  function close(){
    helper.classList.remove('active');
    return 'Help closed.';
  }

  function open(){
    if(!helper.classList.contains('active')) {
      helper.classList.add('active');
    }
    return 'Show the help.'
  }

  function runCode(element){
    var code = element.innerText;
    var message = '', consoleArgs = [];
    code = code.replace('var ', 'window.');
    message = eval(code);

    if(typeof message === 'string'){
      message = message.split(': ');

      if(message.length > 1) {
        message[1] = ': %c' + message[1];
        consoleArgs.push('background: #272822; color: rgba(95, 204, 95, 1); padding: 2px;');
      }

      message = message.join('');
      consoleArgs.unshift(message);
    } else {
      consoleArgs.unshift(message);
    }
    console.log.apply(console, consoleArgs);
  }

  function runCodeOnClick(clickEvent){
    preventEvent(clickEvent);
    runCode(this);
  }

  function runCodeOnEnter(keyEvent){
    var linker;
    if(keyEvent.keyCode === 13){
      preventEvent(keyEvent);

      linker = this.closest('a');
      linker.focus();
      runCode(linker);
    }
  }

  function selectOnFocus(focusEvent){
    var focusedElement = this;
    requestAnimationFrame(function() {
      selectElementContents(focusedElement);
    });
  }

  function selectElementContents(element) {
    var range = document.createRange();
    range.selectNodeContents(element);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function deselect() {
    window.getSelection().removeAllRanges();
  }

  function preventEvent(clickEvent){
    clickEvent.preventDefault();
  }

  function stopEvent(clickEvent){
    clickEvent.stopPropagation();
  }
}

