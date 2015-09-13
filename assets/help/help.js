function setupHelp(){
  var canRuns = document.getElementsByClassName('can-run');
  var justEdits = document.querySelectorAll('[contenteditable]');

  _.each(justEdits, function(editElement){
    editElement.onclick = function(clickEvent){
      clickEvent.stopPropagation();
    }
    editElement.onfocus = function(focusEvent){
      var focusedElement = this;
      requestAnimationFrame(function() {
        selectElementContents(focusedElement);
      });
    }

    editElement.onkeydown = function(keyEvent){
      if(keyEvent.keyCode === 13){
        window.editElement = editElement;
        keyEvent.preventDefault();
        runCode(this.closest('code'));
      }
    }
  });

  _.each(canRuns, function(codeElement){
    codeElement.onclick = function(clickEvent){
      clickEvent.preventDefault();
      runCode(this);
    }
  });


  function runCode(element){
    var code = element.innerText;
    code = code.replace('var ', 'window.')
    console.log(eval(code));
  }

  function selectElementContents(element) {
    var range = document.createRange();
    range.selectNodeContents(element);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

