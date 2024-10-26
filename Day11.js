function init() {
  var firebutton = document.getElementById("firebutton");
  firebutton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleKeyPress(e) {
  var firebutton = document.getElementById("firebutton");
  if (e.keyCode === 13) {
    firebutton.click();
    return false;
  }
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

window.onload = init;

var model = {
  boardsize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: ["0", "0", "0"], hit: ["", "", ""] },
    { locations: ["0", "0", "0"], hit: ["", "", ""] },
    { locations: ["0", "0", "0"], hit: ["", "", ""] },
  ],

  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      //location = ship.location;
      var index = ship.locations.indexOf(guess); // we are using chaining(we combined two lines in one)
      if (index >= 0) {
        ship.hit[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          this.shipsSunk++;
          view.displayMessage(
            "You sank " +
              this.shipsSunk +
              " battleship! out of " +
              this.numShips
          );
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You Missed.");
    return false;
  },

  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hit[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function () {
    var locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },

  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardsize);
      col = Math.floor(Math.random() * (this.boardsize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardsize - this.shipLength));
      col = Math.floor(Math.random() * this.boardsize);
    }

    var newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push(row + i + "" + col);
      }
    }
    return newShipLocations;
  },

  collision: function (locations) {
    for (let i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },
};

var view = {
  displayMessage: function (message) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = message;
  },
  displayHit: function (locations) {
    var cell = document.getElementById(locations);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function (locations) {
    var cell = document.getElementById(locations);
    cell.setAttribute("class", "miss");
  },
};

var controller = {
  guesses: 0,
  processGuess: function (guess) {
    var locations = parseGuess(guess);
    if (locations) {
      this.guesses++;
      var hit = model.fire(locations);
      if (hit && model.numShips === model.shipsSunk) {
        view.displayMessage(
          "You sank all of my battleships, in " +
            this.guesses +
            " guesses. " +
            "\n Press F5 or Refresh the Page."
        );
      }
    }
  },
};

function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, Please Enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar.toUpperCase());
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (
      row < 0 ||
      row >= model.boardsize ||
      column < 0 ||
      column >= model.boardsize
    ) {
      alert("Oops, that's off the board.");
    } else {
      return row + column;
    }
  }
  return null;
}

/*controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");
model.fire("06");
model.fire("16");
model.fire("26");
model.fire("24");
model.fire("34");
model.fire("44");
model.fire("10");
model.fire("01");
model.fire("12");
model.fire("11");
view.displayHit("00");
view.displayMiss("34");
view.displayHit("55");
view.displayMiss("12");
view.displayHit("24");
view.displayMiss("26");
view.displayMessage("All Good!");*/
