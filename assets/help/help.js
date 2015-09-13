function setupHelp(){
  var canRuns = document.getElementsByClassName('can-run');
  var justEdits = document.querySelectorAll('[contenteditable]');

  _.each(justEdits, function(editElement){
    editElement.onclick = function(clickEvent){
      document.execCommand('selectAll',false,null);
      clickEvent.stopPropagation();
    }
  });

  _.each(canRuns, function(codeElement){
    codeElement.onclick = function(clickEvent){
      clickEvent.preventDefault();
      var code = this.innerText;
      code = code.replace('var ', 'window.')
      console.log(eval(code));
    }
  });
}