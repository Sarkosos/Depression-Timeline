var timeoutID;

function delayTimer() {
  timeoutID = setTimeout(delayedFunction, 3000);
}


function delayedFunction() {
  alert(“Three seconds have elapsed.”);
}