if (typeof(Mastermind) == 'undefined') MastermindGame = {};

$(document).ready(function() {
  Mastermind.game.setup();
  Mastermind.game.play("easy");
});
