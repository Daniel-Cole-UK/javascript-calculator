$('document').ready(function() {

// Create an object to store all data
var Memory = {
  entry: 0,
  input: "",
  lastInput: "",
  lastAction: "",
  screenState: "",
  runningTotal: 0
};
// Create a copy of the Memory object to be used later for CE button functionality

//USE 'NEW' FOR MEMORY?

lastMemory = jQuery.extend(true, {}, Memory);
// Create an object to store all calculator functions
var Operators = {
  "percent": function(a, b) {
    return (a * b) / 100;
  },
  "divide": function(a, b) {
    return a / b;
  },
  "multiply": function(a, b) {
    return a * b;
  },
  "plus": function(a, b) {
    return a + b;
  },
  "minus": function(a, b) {
    return a - b;
  }
}

// ----CLEAR FUNCTIONS ---- //
function clear(clearType) {
  // If the AC button is pressed, revert Memory and lastMemory to original state. Update the screen.
  if (clearType === "clearAll") {
    Memory = {
      input: "",
      lastInput: "",
      lastAction: "",
      screenState: "",
      runningTotal: 0
    };
    lastMemory = jQuery.extend(true, {}, Memory);
    $("#screen-text").html(Memory.screenState);
    $("#top-left-screen-text").html("");
    return;
  };
  if (clearType === "clearEvent") {
    // If the CE button is pressed, revert the values of Memory to those stored in lastMemory, then update the screen
    Memory = jQuery.extend(true, {}, lastMemory);
    $("#screen-text").html(Memory.screenState);
    $("#top-left-screen-text").html(Memory.lastAction);
    return;
  };
}

// ---- CALCULATOR ---- //
function calculator(pressedAction) {
  // If this is a press of the percent button and running total is 0, amend input to the percentage of lastInput and update the screen
  if (Memory.lastInput !== "" && pressedAction === "percent" && Memory.runningTotal === 0) {
    $("#screen-text").html(Memory.input = Operators["percent"](Number(Memory.lastInput), Number(Memory.input)));
    return;
  };
  // If this is a press of the percent button and running total is not 0, amend input to the percentage of runningTotal and update the screen
  if (Memory.lastInput !== "" && pressedAction === "percent" && Memory.runningTotal !== 0) {
    $("#screen-text").html(Memory.input = Operators["percent"](Number(Memory.runningTotal), Number(Memory.input)));
    return;
  };
  // If this is the first press of an action button, store the input number and pressed action
  if (Memory.lastInput === "" && pressedAction !=="equals") {
    Memory.lastInput = Memory.input;
    Memory.lastAction = pressedAction;
    Memory.input = "";
    $("#screen-text").html(Memory.input);
    $("#top-left-screen-text").html(Memory.lastAction);
    return;
  };
  // If this is the second press of an action button, update the running total and display
  if (Memory.lastInput !== "" && pressedAction !== "equals" && Memory.runningTotal === 0) {
    $("#screen-text").html(Memory.runningTotal += Operators[Memory.lastAction](Number(Memory.lastInput), Number(Memory.input)));
    Memory.lastInput = Memory.input;
    Memory.lastAction = pressedAction;
    $("#top-left-screen-text").html(Memory.lastAction);
    Memory.input = "";
    return;
  };
  // If this is more than the second press of an action button, update the running total (without using lastInput) and update the screen
  if (Memory.lastInput !== "" && pressedAction !== "equals" && Memory.runningTotal !== 0) {
    $("#screen-text").html(Memory.runningTotal = Operators[Memory.lastAction](Number(Memory.runningTotal), Number(Memory.input)));
    Memory.lastInput = Memory.input;
    Memory.lastAction = pressedAction;
    $("#top-left-screen-text").html(Memory.lastAction);
    Memory.input = "";
    return;
  };
  
  // If this is a press of the equals button after < 2 action button presses, update the running total, display, then clear out everything in Memory.
  if (Memory.lastInput !== "" && pressedAction === "equals" && Memory.runningTotal === 0) {
    $("#screen-text").html(Memory.runningTotal += Operators[Memory.lastAction](Number(Memory.lastInput), Number(Memory.input)));
    $("#top-left-screen-text").html = "";
    Memory.input = Memory.runningTotal;
    Memory.lastInput = "";
    Memory.lastAction = "";
    Memory.runningTotal = 0;
    return;
  };
  // If this is a press of the equals button after > 1 action button presses, update the running total (without using lastInput), display, then clear out everything in Memory. 
  if (Memory.lastInput !== "" && pressedAction === "equals" && Memory.runningTotal !== 0) {
    $("#screen-text").html(Memory.runningTotal = Operators[Memory.lastAction](Number(Memory.runningTotal), Number(Memory.input)));
    $("top-left-screen-text").html("");
    Memory.input = Memory.runningTotal;
    Memory.lastInput = "";
    Memory.lastAction = "";
    Memory.runningTotal = 0;
    return;
  };

}

// ---- CLEAR BUTTONS ---- //
$('.clear').click(function() {
  clear($(this).val());
});

// ---- ACTION BUTTONS ---- //
$('.action').click(function() {
  // If no numbers have been input, do nothing
  if ($("#screen-text").html() === "") {
    return;
  };
  // Take backup of memory and screen unless this is a press of equals.
  if ($(this).val !== "equals") {
  lastMemory = jQuery.extend(true, {}, Memory);
  lastMemory.screenState = $("#screen-text").html;
  };
  // Pass action value to calculator function
  calculator($(this).val());
});

// ---- NUMBER BUTTONS ---- //
$('.number').click(function() {
  //Prevent multiple decimal places and screen text length of > 10
  if (Memory.input.indexOf(".") !== -1 && $(this).val() === "." || Memory.input.length === 10) {
    return;
  };
  Memory.input += $(this).val();
  $("#screen-text").html(Memory.input);
});
  
});