/*
Notes:
I want the world to have this. Free. For all.
I wont charge a dime. In the spirit of the selfless heros before me,
these ideas are for you and everyone who can use them.
Rock on comrades!

Phases:
  Plan architecture
    Java to facilitate android app later.
    prototype in JS for rapid dev.
    Entirely local to start
      Easy to dev and package.
      No hosting or internet needed for users.
      Can add hosted version later for people without linux powers
  programming structure:
    Strategy:
      vertical slicing. (Fake and ugly until improved.)
      I will still starve after I write this. I hope my kids will understand why I chose this someday.
    unit testing
      written whenever a feature seems solid
    language/tools:
      java/phonegap
      open source speech to text engines.
      OSS text to speech
      Open source cyoa stories
Tonight:
  Download a FOSS Choose your own adventure from a library of some sort.
    twine is cool, but I dont see any downloadable stories..
    https://github.com/textadventures/quest
    Cool but in VB which seems gross.
    Lets start with a super simple OO java text based adventure.
    Later I should find a library of choose your own adventure stories.
    http://ifdb.tads.org/
    Cant read the formats.
    Cool idea to include music.
    All for later.
    For now, my own simple format:

    text to read
    [options to listen for]

    {
      "roomName":"bedroom",
      "roomText":"It is story time! What should you do next?",
      "options":[
        {
          text:"go forward",
          destination:"hallway"
        }, {
          text:"go back",
          destination:"bedroom"
        }
      ]
    }
  Convert this into a playable text based game.[Done]
    JS prototype[Done]
  Speak the text aloud.[Done, buggy overlapping robot voice]
    Fixed overlap by using synchronous mode
  Allow voice inputs.
  Refactor the entire thing once before going public.
  Get cousins/Hayley to beta test.
  Refactor as per their feedback
  Make raspberry pi version
    minimize the install headache.
    Maybe a livecd/usb?
    a vm?
    android app.
*/
var readline = require('readline');
var input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
var state = {currentRoom:"bedroom"};

var world = [{
  "roomName":"bedroom",
  "roomText":"It is story time! What should you do next?",
  "options":[
    {
      text:"go forward",
      destination:"hallway"
    }, {
      text:"go away",
      destination:"away"
    }
  ]
},{
  "roomName":"hallway",
  "roomText":"It is the awesome hallway!",
  "options":[
    {
      text:"stay here",
      destination:"hallway"
    }, {
      text:"go bedroom",
      destination:"bedroom"
    }
  ]
}];

function o(str){
  console.log(str);
  speak(str);
}

const exec = require('child_process').execSync;
function speak(text){
  exec('espeak \"' + text + '\"', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
}

o("You just lost the game!");


input.on('line', function(line){
    handleCommand(line);
})

function handleCommand(command){
  /*
  For each option in the room, check to see if the input matches
  If so, go to destination and print the new roomtext
  */
  for(var room = 0; room < world.length; room++){
    for(var option = 0; option < world[room].options.length; option++){
      var destOption = world[room].options[option].text;

      if(command === destOption){
        goTo(world[room].options[option].destination);
        break;
      }

    }
  }
}

function goTo(newRoom){
  var dest;
  for(var room = 0; room < world.length; room++){
    if(newRoom === world[room].roomName){
      dest = world[room];
    }
  }
  o("Changed room to: " + dest.roomName);
  state.currentRoom = dest;
  readText(state.currentRoom.roomText);
  readOptions(state.currentRoom.options);
}

//TODO: Text to speech
function readText(room){
  o(room);
};

function readOptions(roomOptions){
  o("Choices are: ");
  for(var optionIndex = 0; optionIndex < roomOptions.length; optionIndex++){
    o("\t" + roomOptions[optionIndex].text);
  }
}
