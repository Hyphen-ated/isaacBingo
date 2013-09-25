$(function() { bingo.bingo(goals); });



goals = [];
bingo.bingo = function (goals) {
  var checkbox = document.getElementById('showDifficulty');
  checkbox.onchange = function() {
    if(this.checked) {
      bingo.addAllDifficultyClasses();
    } else {
      bingo.removeAllDifficultyClasses();
    }
  }

  var seed = gup('seed');
  if (seed == "") {
    window.location = '?seed=' + Math.ceil(1000*1000*1000 * Math.random()).toString(36);
    return;
  }

  seed = seed.toLowerCase();
  Math.seedrandom(seed); //sets up the RNG
  var results = $("#results");
  results.append ("<p></p>");

  this.hardPositions = [2,9,11,18,20];
  this.mediumPositions = [0,3,5,7,12,14,16,19,21,23];
  this.easyPositions = [1,4,6,8,10,13,15,17,22,24];

  readGoals("hard", hardGoals);
  readGoals("medium", mediumGoals);
  readGoals("easy", easyGoals);

  //compute the exclusions of the goals
  makeExclusions(goals["hard"]);
  makeExclusions(goals["medium"]);
  makeExclusions(goals["easy"]);

  var bingoBoard = [];
  var invalidNames = [];
  addGoals(bingoBoard, goals["hard"], this.hardPositions, invalidNames);
  addGoals(bingoBoard, goals["medium"], this.mediumPositions, invalidNames);
  addGoals(bingoBoard, goals["easy"], this.easyPositions, invalidNames);

  //populate the actual table on the page
  for (var i=0; i<25; i++) {
    $('#slot'+i).append(bingoBoard[i].label);
  }

  function addGoals(board, goals, positions, invalidNames) {

    for(var i = 0; i < positions.length; ++i) {
      position = positions[i];

      var candidates = buildCandidates(goals, invalidNames);
      var newGoalIdx = Math.floor((Math.random() * candidates.length));
      var newGoal = candidates[newGoalIdx];
      board[position] = {label: newGoal.label};
      invalidNames.push(newGoal.name);
      if(typeof newGoal.exclusions != 'undefined') {
        var excl = newGoal.exclusions;
        for(var j = 0; j < excl.length; ++j) {
          invalidNames.push(excl[j]);
        }
      }
    }

  }

  function buildCandidates(goals, usedNames) {
    var candidates = [];
    for(var i = 0; i <goals.length; ++i) {
      var candidate = goals[i];
      if($.inArray(candidate.name, usedNames) != -1) {
          continue;
      }
      candidates.push(candidate);
    }
    return candidates;
  }

  function makeExclusions(goals) {
    for(var i = 0; i < exclusions.length; ++i) {
      excl = exclusions[i];
      for(var j = 0; j < goals.length; ++j) {
        goal = goals[j];
        //if the goal is mentioned by the exclusion list
        if($.inArray(goal.name, excl) != -1) {
          if(typeof goal.exclusions === 'undefined') {
            goal.exclusions = [];
          }
          //then add all the other things in the list into this goal's exclusion
          for(var k = 0; k < excl.length; ++k) {
            var otherGoalName = excl[k];
            if(otherGoalName != goal.name) {
              goal.exclusions.push(otherGoalName);
            }
          }
        }
      }
    }
  }

  function readGoals(difficulty, someGoals) {
    goals[difficulty] = [];
    for(var i = 0; i < someGoals.length; ++i) {
      var goalStr = someGoals[i];
      var parts = goalStr.split('|');
      var goal = {};
      goal.label = parts[0];
      goal.name = parts[1];
      goals[difficulty].push(goal);
    }
  }



  //gets url parameter
  function gup( name ) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return "";
    else
      return results[1];
  }

   $("#bingo tr td:not(.no), #selected td").toggle(
    function () {
      $(this).addClass("greensquare");
    },
    function () {
      $(this).addClass("redsquare").removeClass("greensquare");
    },
    function () {
      $(this).removeClass("redsquare");
    }

  );
  


} // bingo.bingo

bingo.addAllDifficultyClasses = function () {
    this.addDifficultyClasses("hard",this.hardPositions);
    this.addDifficultyClasses("medium",this.mediumPositions);
    this.addDifficultyClasses("easy",this.easyPositions);
  }
  
bingo.removeAllDifficultyClasses = function () {
  for(var i = 0; i < 25; ++i) {
    $('#slot'+i).removeClass("hard medium easy");
  }
}

bingo.addDifficultyClasses = function (className, positions) {
  for(var i =0; i < positions.length; ++i) {
    var pos = positions[i];
    $('#slot'+pos).addClass(className);
  }
}