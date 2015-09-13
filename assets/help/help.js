function setupHelp(){
  var canRuns = document.getElementsByClassName('can-run');
  var justEdits = document.querySelectorAll('[contenteditable]');

  _.each(justEdits, function(editElement){
    editElement.onclick = stopEvent;
    editElement.onfocus = selectOnFocus;
    editElement.onblur = deselect;
    editElement.onkeydown = runCodeOnEnter;
  });

  _.each(canRuns, function(codeElement){
    codeElement.onclick = runCodeOnClick;
  });


  function runCode(element){
    var code = element.innerText;
    code = code.replace('var ', 'window.')
    console.log(eval(code));
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

  function stopEvent(clickEvent){
    clickEvent.stopPropagation();
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
}

