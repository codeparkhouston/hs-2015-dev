function setupHelp(){
  var helper = document.getElementsByClassName('help')[0];
  var closer = document.getElementsByClassName('close')[0];
  var canRuns = document.getElementsByClassName('can-run');
  var justEdits = document.querySelectorAll('[contenteditable]');
  console.log('Type "robot." here to get started!');

  _.each(justEdits, function(editElement){
    editElement.onclick = stopEvent;
    editElement.onfocus = selectOnFocus;
    editElement.onblur = deselect;
    editElement.onkeydown = runCodeOnEnter;
  });

  _.each(canRuns, function(codeElement){
    codeElement.onclick = runCodeOnClick;
  });

  closer.onclick = close;


  function close(clickEvent){
    clickEvent.preventDefault();
    helper.classList.remove('active');
  }


  function runCode(element){
    keepHelpOpen();
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
    clickEvent.preventDefault();
    runCode(this);
  }

  function runCodeOnEnter(keyEvent){
    var linker;
    if(keyEvent.keyCode === 13){
      keyEvent.preventDefault();
      linker = this.closest('a');
      linker.focus();
      runCode(linker);
    }
  }

  function keepHelpOpen(){
    if(!helper.classList.contains('active')) {
      helper.classList.add('active');
    }
  }

  function stopEvent(clickEvent){
    clickEvent.stopPropagation();
  }

  function selectOnFocus(focusEvent){
    keepHelpOpen();
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
}

