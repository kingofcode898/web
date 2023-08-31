document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('popupContainer').style.display = 'block';
});

const popupContainer = document.getElementById('popupContainer');
const closePopup = document.getElementById('Play');

// Close the pop-up when the close button is clicked
closePopup.addEventListener('click', () => {
  popupContainer.style.display = 'none';
});

// Add event listener to close the pop-up when clicking outside the pop-up content
window.addEventListener('click', (event) => {
  if (event.target === popupContainer) {
    popupContainer.style.display = 'none';
  }
});

let targetWord;

generateRandomWord().then(randomWord => {
  targetWord = randomWord;

});

document.getElementById('word-input').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default form submission behavior
    checkGuess(); // Call your function here
  }
});

document.getElementById('guess-btn').addEventListener('click', checkGuess);
document.addEventListener


async function generateRandomWord() {
  try {
    const response = await fetch('./words.txt'); // Await the fetch operation
    const content = await response.text(); // Await the response.text() operation
    console.log(content);

    const listOfWords = content.split(',');

    const randomIndex = Math.floor(Math.random() * listOfWords.length);
    const randomWord = listOfWords[randomIndex];
    console.log('Random word:', randomWord);
    return randomWord;

  } catch (error) {
    console.error('Error reading the file:', error);
  }
}

let numguess = 1; // Initialize numguess outside the function

function mapLetters(targetWord) {
  const alphabetMapping = {
    a: 0, b: 0, c: 0, d: 0, e: 0,
    f: 0, g: 0, h: 0, i: 0, j: 0,
    k: 0, l: 0, m: 0, n: 0, o: 0,
    p: 0, q: 0, r: 0, s: 0, t: 0,
    u: 0, v: 0, w: 0, x: 0, y: 0, z: 0
  };

  for (let letter of targetWord) {
    if (alphabetMapping.hasOwnProperty(letter)) {
      alphabetMapping[letter]++;
    }
  }

  return alphabetMapping;
}



function checkGuess() {
  const guess = document.getElementById('word-input').value.toLowerCase();
  
  // Update the color of the appropriate squares based on numguess
  let square1 = document.getElementById(`square1row${numguess}`);
  let square2 = document.getElementById(`square2row${numguess}`);
  let square3 = document.getElementById(`square3row${numguess}`);
  let square4 = document.getElementById(`square4row${numguess}`);
  let square5 = document.getElementById(`square5row${numguess}`);
  
  const squares = [square1, square2, square3, square4, square5];

  const Lettermap = mapLetters(targetWord);

  if (guess.length !== 5) {
    document.getElementById('result').textContent = 'Please enter a 5-letter word.';
    return;
  }

  let resultText = ''; // Initialize resultText
  for (let i = 0; i < 5; i++) {
    let square = squares[i];
    if (guess[i] === targetWord[i]) {
      square.textContent = guess[i].toUpperCase();
      square.style.backgroundColor = '#45E66E'; 
      Lettermap[guess[i]]--; // Decrement frequency
    } else if (Lettermap[guess[i]] > 0) { // Check frequency
      square.textContent = guess[i].toUpperCase();
      square.style.backgroundColor = '#FFE12E'; 
      Lettermap[guess[i]]--; // Decrement frequency
    } else {
      square.textContent = guess[i].toUpperCase();
    }
    resultText += square.textContent; // Add the content of the square to resultText
  }

  if (resultText === targetWord.toUpperCase()) {
    resultText = `Congratulations! You guessed the word: ${targetWord.toUpperCase()}`;
    document.getElementById('guess-btn').disabled = true;
  } else if (numguess >= 5) {
    resultText = 'Sorry you ran out of guesses.';
    document.getElementById('guess-btn').disabled = true;
  }

  document.getElementById('result').textContent = resultText; // Update the result display
  
  numguess++;
}

