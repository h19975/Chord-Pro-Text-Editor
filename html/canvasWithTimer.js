/*
Client-side javascript for 2406 assignment 2

*/
let words = [] //array of drag-able lyrics or chord words

//leave this moving word for fun and for using it to
//provide status info to client.
//NOT part of assignment requirements
let movingString = {
  word: "Moving",
  x: 100,
  y: 100,
  xDirection: 1, //+1 for rightwards, -1 for leftwards
  yDirection: 1, //+1 for downwards, -1 for upwards
  stringWidth: 50, //will be updated when drawn
  stringHeight: 24
} //assumed height based on drawing point size


let timer //timer for animation of moving string etc.
let wordBeingMoved //word being dragged by the mouse
let deltaX, deltaY //location where mouse is pressed relative to word origin
let canvas = document.getElementById('canvas1') //our drawing canvas
let fontPointSize = 18 //point size for chord and lyric text
let wordHeight = 20 //estimated height of a string in the editor
let editorFont = 'Courier New' //font for your editor -must be monospace font
let lineHeight = 40 //nominal height of text line
let lyricLineOffset = lineHeight * 5 / 8 //nominal offset for lyric line below chords
let topMargin = 40 //hard coded top margin white space of page
let leftMargin = 40 //hard code left margin white space of page
let wordsBeingMoved = [] //all words being dragged by mouse
let wordTargetRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
} //used for debugging
//rectangle around word boundary


function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY co-ordinates
  //aCanvasX and aCanvasY are assumed to be X,Y loc
  //relative to upper left origin of canvas

  //used to get the word mouse is clicked on

  let context = canvas.getContext('2d')

  for (let i = 0; i < words.length; i++) {
    let wordWidth = context.measureText(words[i].word).width
    if ((aCanvasX > words[i].x && aCanvasX < (words[i].x + wordWidth)) &&
      (aCanvasY > words[i].y - wordHeight && aCanvasY < words[i].y)) {
      //set word targeting rectangle for debugging
      wordTargetRect = {
        x: words[i].x,
        y: words[i].y - wordHeight,
        width: wordWidth,
        height: wordHeight
      }
      return words[i]
    } //return the word found
  }
  return null //no word found at location
}

function drawCanvas() {

  let context = canvas.getContext('2d')
  let lyricFillColor = 'cornflowerblue'
  let lyricStrokeColor = 'blue'
  let chordFillColor = 'green'
  let chordStrokeColor = 'green'

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '' + fontPointSize + 'pt ' + editorFont
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  //draw drag-able lyric and chord words
  for (let i = 0; i < words.length; i++) {
    let data = words[i]
    if (data.lyric) {
      context.fillStyle = lyricFillColor
      context.strokeStyle = lyricStrokeColor
    }
    if (data.chord) {
      context.fillStyle = chordFillColor
      context.strokeStyle = chordStrokeColor
    }
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)
  }

  //draw box around word last targeted with mouse -for debugging
  //context.strokeRect(wordTargetRect.x, wordTargetRect.y, wordTargetRect.width, wordTargetRect.height);

  /*
    context.fillStyle = 'red';
    movingString.stringWidth = context.measureText(	movingString.word).width;
    context.fillText(movingString.word, movingString.x, movingString.y);
	*/


}

function getCanvasMouseLocation(e) {
  //provide the mouse location relative to the upper left corner
  //of the canvas

  /*
  This code took some trial and error. If someone wants to write a
  nice tutorial on how mouse-locations work that would be great.
  */
  let rect = canvas.getBoundingClientRect()

  //account for amount the document scroll bars might be scrolled
  let scrollOffsetX = $(document).scrollLeft()
  let scrollOffsetY = $(document).scrollTop()

  let canX = e.pageX - rect.left - scrollOffsetX
  let canY = e.pageY - rect.top - scrollOffsetY

  return {
    canvasX: canX,
    canvasY: canY
  }

}

function handleMouseDown(e) {

  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.canvasX
  let canvasY = canvasMouseLoc.canvasY
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word);
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event and stop any default
  //  browser action

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

function handleMouseMove(e) {

  //console.log("mouse move");

  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.canvasX
  let canvasY = canvasMouseLoc.canvasY

  console.log("move: " + canvasX + "," + canvasY)

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY
  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {
  //console.log("mouse up")
  e.stopPropagation()

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  if (!wordsBeingMoved.includes(wordBeingMoved))
    wordsBeingMoved.push(wordBeingMoved)
  drawCanvas() //redraw the canvas
}


function handleTimer() {
  movingString.x = (movingString.x + 5 * movingString.xDirection)
  movingString.y = (movingString.y + 5 * movingString.yDirection)

  //keep moving string within canvas bounds
  if (movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1
  if (movingString.x < 0) movingString.xDirection = 1
  if (movingString.y > canvas.height) movingString.yDirection = -1
  if (movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1

  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  //console.log("keydown code = " + e.which );
  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  //console.log("key UP: " + e.which);
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    //do nothing for now
  }

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    $('#userTextField').val('') //clear the user text field
  }

  e.stopPropagation()
  e.preventDefault()

}


function parseChordProFormat(chordProLinesArray) {
  //parse the song lines with embedded chord pro chords into individual movable words

  //clear any newline or return characters as a precaution --might not be needed
  for (let i = 0; i < chordProLinesArray.length; i++) {
    chordProLinesArray[i] = chordProLinesArray[i].replace(/(\r\n|\n|\r)/gm, "");
  }

  //add the lines of text to html <p> elements
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ''
  
  for (let i = 0; i < chordProLinesArray.length; i++) {
    let line = chordProLinesArray[i]
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${line}</p>`

    let isReadingChord = false
    let chordLine = ''
    let lyricLine = ''
    let chordLength = 0

    //separate chords and lyrics by a blank. Preserve the [] characters in chord symbols
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      let ch = line.charAt(charIndex)
      if (ch === '[') {
        isReadingChord = true
        chordLength = 0
      }
      if (ch === ']') {
        isReadingChord = false
      }
      if (!isReadingChord && ch != ']') {
        lyricLine = lyricLine + ch
        if (chordLength > 0) chordLength-- //consume chord symbol char
          else chordLine = chordLine + " " //pad chord line with blank
      }
      if (isReadingChord && ch != '[') {
        chordLine = chordLine + ch
        chordLength++
      }
    }
    console.log(chordLine)
    console.log(lyricLine)
    //Now turn lyrics line and chords line into individual drag-able words
    //Create Movable Words
    const characterWidth = canvas.getContext('2d').measureText('m').width; //width of one character

    //Make drag-able chords
    if (chordLine.trim().length > 0) {
      let theChordWord = ''
      let ChordWordWithoutSpace = ''
      let xPositionOffset = 0
      let yPositionOffset = 0
      for (let j = 0; j < chordLine.length; j++) {
        if ((chordLine[j] != ' ' && j == chordLine.length -1) || (chordLine[j] != ' ' && chordLine[j+1] == ' ')) {
          theChordWord += chordLine[j]
          ChordWordWithoutSpace = theChordWord.trim()
          let word = {
            word: ChordWordWithoutSpace,
            x: leftMargin + (j-ChordWordWithoutSpace.length+1) * characterWidth,
            y: topMargin + i * 2 * lineHeight,
          }
          word.chord = 'chord'
          console.log(word)
          words.push(word)
          theChordWord = ''
          ChordWordWithoutSpace = ''
        } else {
          theChordWord += chordLine[j]
        }
      }
    }

    //Make drag-able lyric
    lyricLine += ' '; //add blank to lyrics line just so it conveniently ends in a blank
    if (lyricLine.trim().length > 0) {
      let theLyricWord = ''
      let theLyricLocationIndex = -1
      for (let j = 0; j < lyricLine.length; j++) {
        let ch = lyricLine.charAt(j)
        if (ch == ' ') {
          //start or end of word or chord symbol
          if (theLyricWord.trim().length > 0) {
            let word = {
              word: theLyricWord,
              x: leftMargin + theLyricLocationIndex * characterWidth,
              y: topMargin + i * 2 * lineHeight + lyricLineOffset,
            }

            word.lyric = 'lyric'

            words.push(word)

          }
          theLyricWord = ''
          theLyricLocationIndex = -1

        } else {
          //its part of a lyric word
          theLyricWord += ch
          if (theLyricLocationIndex === -1) theLyricLocationIndex = j
        }
      }
    } //end make lyric chord words
  }
}

function makeDragableWords(line, isChord, offset) {
  const characterWidth = canvas.getContext('2d').measureText('m').width;
  if (!isChord) {
    let wordsInSameLine = line.split(' ');
    let locationIndex = 0;
    for (let i = 0; i < wordsInSameLine.length; i++) {
      let word = {
        word: wordsInSameLine[i],
        x: leftMargin + locationIndex * characterWidth,
        y: topMargin + offset
      }
      word.lyric = 'lyric'
    }
  } else {
    for (let ch of line) {

    }
  }
  words.push(word)
}

function transpose(theWords, semitones){
  //Transpose any of the chords in the array of word objects theWords by
  //semitones number of musical steps or semi-tones.
  //semitones is expected to be an integer between -12 and +12
  if(semitones === 0) return //nothing to do
  for (let i = 0; i < words.length; i++) {
    if (words[i].chord) {
      words[i].word = transposeChord(words[i].word, semitones)
    }
  }
}

function transposeChord(aChordString, semitones){
  console.log(`transposeChord: ${aChordString} by ${semitones}`)
  /*transpose aChordString by semitones
  aChordString is expected to be like: '[Gm7]' or '[F#maj7]'
  Strategy: look for the position of the chord letter name in hard-coded array of
  letter names and if found replace the characters with the ones offset by the argument
  semitones.
  For example to transpose A#m up by three semitones find for A# in RootNamesWithSharps
  array (which would be 1) then replace A# with the name found at RootsNamesWithSharps[1+3]
  which would be C#. Hence A#m transposed up three semitones would be C#m.
  */
  const RootNamesWithSharps = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#']
  const RootNamesWithFlats = ['A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab']
  let rootNames = RootNamesWithSharps
  let rootNameIndex = -1
  let transposedChordString = ''
  for(let i = 0; i< aChordString.length; i++){
    if(rootNames.findIndex(function(element){return element === aChordString[i]}) === -1) {
      //character is not start of a chord root name (i.e. is not A,B,C,D,E,F, or G)
      if((aChordString[i] !== '#') && (aChordString[i] !== 'b')) //skip # and b suffix
         transposedChordString += aChordString[i]
    }
    else {
      //character is start of a chord name root (i.e. A,B,C,D,E,F, or G)
      let indexOfSharp = -1
      let indexOfFlat = -1
      //check to see if we are dealing with names like A# or Bb
      if(i<aChordString.length -1){
        indexOfSharp = RootNamesWithSharps.findIndex(function(element){return element === (aChordString[i] + aChordString[i+1])})
        if(indexOfSharp !== -1) transposedChordString += RootNamesWithSharps[(indexOfSharp + 12 + semitones) % 12]
        indexOfFlat = RootNamesWithFlats.findIndex(function(element){return element === (aChordString[i] + aChordString[i+1])})
        if(indexOfFlat !== -1) transposedChordString += RootNamesWithFlats[(indexOfFlat + 12 + semitones) % 12]
      }
      if((indexOfSharp === -1) && (indexOfFlat === -1)){
         //chord name is letter without a # or b
         let index = rootNames.findIndex(function(element){return element === aChordString[i]})
         if(index !== -1) transposedChordString += rootNames[(index + 12 + semitones) % 12]
      }
    }
  }
  return transposedChordString
}

function handleTransposeUpButton(){
  transpose(words, 1)
  drawCanvas()
}

function handleTransposeDownButton(){
  transpose(words, -1)
  drawCanvas()
}


function handleSubmitButton() {

  let userText = $('#userTextField').val() //get text from user text input field
  //clear lines of text in textDiv
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ''

  if (userText && userText !== '') {
    let userRequestObj = {
      text: userText
    }
    let userRequestJSON = JSON.stringify(userRequestObj)
    $('#userTextField').val('') //clear the user text field

    //alert ("You typed: " + userText);
    $.post("fetchSong", userRequestJSON, function(data, status) {
      console.log("data: " + data)
      console.log("typeof: " + typeof data)
      let responseObj = data
      movingString.word = responseObj.text
      words = [] //clear drag-able words array;
      if (responseObj.songLines) parseChordProFormat(responseObj.songLines);
    })
  }
}


function handleSaveButton() {
  let userText = $('#userTextField').val() //get new file name from user text input field

  //prepare JOSN object that will be sent to server
  let content = rearrangeTextBelow();
  if (userText && userText !== '') {
    let userSaveObj = {
      fileName: userText,
      fileContent: content
    }
    let userSaveObjJSON = JSON.stringify(userSaveObj)
    $('#userTextField').val('') //clear the user text field

    //send to server
    $.post("saveSong", userSaveObjJSON, function(data, status) {
      console.log("data: " + data)
    })
  }
}


function handleRefreshButton() {
  wordsBeingMoved.sort(function(a, b) {return a.y - b.y} )
  console.log(wordsBeingMoved)
  let chordsBeingMoved = wordsBeingMoved.filter(word => word.chord)
  let lyricsBeingMoved = wordsBeingMoved.filter(word => word.lyric)
  let chordsLineGroup = []
  const characterWidth = canvas.getContext('2d').measureText('m').width;
  //group chords together
  for (let i = 0; i < chordsBeingMoved.length; i++) {
    let currentHeight = chordsBeingMoved[i].y
    let chordsInOneLine = []
    //gourp chords within 2 lineHeight y-direction in the same line
    for (; i < chordsBeingMoved.length && chordsBeingMoved[i].y <= currentHeight+lineHeight*2; i++) {
      chordsBeingMoved[i].y = currentHeight
      chordsInOneLine.push(chordsBeingMoved[i])
    }
    i--
    chordsLineGroup.push(chordsInOneLine)
    //make sure no x-direction overlap with chords in the same line
    chordsInOneLine.sort(function(a, b) {return a.x - b.x})
    for (let j = 0; j < chordsInOneLine.length-1; j++) {
      if (chordsInOneLine[j+1].x < chordsInOneLine[j].x + chordsInOneLine[j].word.length*characterWidth) {
        //update word.x if overlap occurs
        chordsInOneLine[j+1].x = chordsInOneLine[j].x + (chordsInOneLine[j].word.length+1)*characterWidth
      }
    }
  }

  //group lyrics under chords
  let lyricLineGroup = []
  for (let i = 0; i < chordsLineGroup.length; i++) {
    let currentHeight = chordsLineGroup[i][0].y
    let lyricInOneLine = lyricsBeingMoved.filter(word => word.y <= currentHeight+lineHeight*2+lyricLineOffset)
    //make sure no x-direction overlap in the same line
    lyricInOneLine.sort(function(a,b) {return a.x - b.x})
    for (let j = 0; j < lyricInOneLine.length-1; j++) {
      lyricInOneLine[j].y = currentHeight + lyricLineOffset
      if (lyricInOneLine[j+1].x < lyricInOneLine[j].x + lyricInOneLine[j].word.length*characterWidth) {
        //update word.x if overlap occurs
        lyricInOneLine[j+1].x = lyricInOneLine[j].x + (lyricInOneLine[j].word.length+1)*characterWidth
      }
    }
    lyricInOneLine[lyricInOneLine.length-1].y = currentHeight + lyricLineOffset
    lyricsBeingMoved = lyricsBeingMoved.filter(word => word.y > currentHeight+lineHeight*2+lyricLineOffset)
  }

  // refresh the buttom text
  let content = rearrangeTextBelow()
  let textDiv = document.getElementById("text-area")
  content = content.split('\n')
  textDiv.innerHTML = ''
  for (let j = 0; j < content.length; j++) {
    textDiv.innerHTML += `<p> ${content[j]}</p>`
  }

  //update canvas
  drawCanvas()
}

//function below helps to rearrange the text displayed at the bottom
function rearrangeTextBelow() {
  let content = ''
  words.sort(function(a, b) { return a.y - b.y})
  //sort words based on y and x, and convert it into string
  let i = 0
  while (i < words.length) {
    let wordsInOneLine = words.filter(word => word.y == words[i].y || word.y == words[i].y+lyricLineOffset)
    wordsInOneLine.sort(function(a,b) {return a.x - b.x})
    for (let j = 0; j < wordsInOneLine.length; j++) {
      if (wordsInOneLine[j].chord) {
        content += '['
      }
      content += wordsInOneLine[j].word
      if (wordsInOneLine[j].chord) {
        content += ']'
      }
      if (j != wordsInOneLine.length - 1) {
        content += ' '
      }
    }
    content += '\n'
    i += wordsInOneLine.length
  }
  return content
}

$(document).ready(function() {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  $(document).keydown(handleKeyDown)
  $(document).keyup(handleKeyUp)

  timer = setInterval(handleTimer, 100) //animation timer
  //clearTimeout(timer); //to stop timer

  drawCanvas()
})