function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
    var elementsToShuffle = arr.length;
    var shuffleElement, unshuffledElement;
    while (elementsToShuffle) {
        shuffleElement = Math.floor(Math.random() * elementsToShuffle--);
        unshuffledElement = arr[elementsToShuffle];
        arr[elementsToShuffle] = arr[shuffleElement];
        arr[shuffleElement] = unshuffledElement;
    }
    return arr;
}

function Game() {
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    if (this.playersGuess === this.winningNumber || this.pastGuesses.length === 5) {
        return "";
    }    
    else if (this.playersGuess < this.winningNumber) {
        return "It's higher!";
    }
    else if (this.playersGuess > this.winningNumber) {
        return "It's lower!";
    }
}

Game.prototype.playersGuessSubmission = function(n) {
    if (n >= 1 && n <= 100 && Number.isInteger(n)) {
        this.playersGuess = n;
        return this.checkGuess(n);
    }
    else {
        throw "That is an invalid guess.";
    }
}

Game.prototype.checkGuess = function(n) {
    if (n === this.winningNumber) {
        return "You Win! Reset to play again.";
    }
    else if (this.pastGuesses.length === 4) {
        this.pastGuesses.push(n);
        return "You Lose. Reset to play again.";
    }
    else if (this.pastGuesses.includes(n)) {
        return "You have already guessed that number.";
    }
    else {
        this.pastGuesses.push(n);
        var difference = Math.abs(this.playersGuess - this.winningNumber);
        if (difference < 10) {
            return "You're burning up!";
        }
        else if (difference < 25) {
            return "You're lukewarm."
        }
        else if (difference < 50) {
            return "You're a bit chilly.";
        }
        else if (difference < 100) {
            return "You're ice cold!";
        }
    }    
}

function newGame() {
    return new Game;
}

Game.prototype.provideHint = function() {
    hintArr = [this.winningNumber];
    hintArr.push(generateWinningNumber());
    hintArr.push(generateWinningNumber());
    return shuffle(hintArr);
}

$(document).ready(function() {
    
    var game = new Game();
    
    $('#number-input').keypress(function(event) {
        if (event.which == 13) {
           processGuess(game);
        }
    });

    $("#submit").on('click', function(e) {
        processGuess(game);
    });

    $("#reset").click(function() {
        var game = new Game();
        $("#past-guesses").empty();
        $("#guess-check-message").text("");
        $("#number-input").val("");
        toggleDisableGame();
    });

    $("#hint").click(function() {
        var hints = game.provideHint();
        $("#guess-check-message").text(`Hint: It's one of the following: ${hints[0]}, ${hints[1]}, or ${hints[2]}`);
    });

});

function processGuess(game) {    
    var guess = $("#number-input").val();
    $("#number-input").val("");

    var result = game.playersGuessSubmission(parseInt(guess));

    if (game.pastGuesses.length === 5 || game.playersGuess === game.winningNumber) {
        toggleDisableGame();
        $("#guess-check-message").text(result);
        if (game.playersGuess !== game.winningNumber) {
            $(`<li>${guess}</li>`).appendTo($("#past-guesses"));
        }    
    }
    else {
        var lower = game.isLower();
        $("#guess-check-message").text(`${result} ${lower}`);
        $(`<li>${guess}</li>`).appendTo($("#past-guesses"));
    }
}

function toggleDisableGame() {
    $("#submit").prop("disabled", function(i, val) {return !val;});
    $("#hint").prop("disabled", function(i, val) {return !val;});
    $("#number-input").prop("disabled", function(i, val) {return !val;});

}