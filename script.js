const guessGrid = document.querySelector('[data-guess-grid]')
const alertContainer = document.querySelector('[data-alert-container]')
const keyboard = document.querySelector('[data-keyboard]')
const tries = document.querySelector('[data-tries]')
const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
let numberOfTries = 0
let temp = ""
// encontra um apalavra aleatória
const randomIndex = Math.floor(Math.random() * targetWords.length) //seleciona um index aleatório
const randomWord = targetWords[randomIndex] //seleciona uma palavra na lista usando o index
const targetWord = randomWord

statsStart()

let numberOfGames = parseInt(localStorage.getItem('numberOfGames'))
let numberOfVictories = parseInt(localStorage.getItem('numberOfVictories'))
let numberOfFails = parseInt(localStorage.getItem('numberOfFails'))

startInteraction()
showAlert('Can you guess the word?', duration = 1500)
localStorage.setItem('numberOfGames', (numberOfGames + 1).toString())

// Checa se é a primeira vez jogando e atribui as variáveis numéricas
function statsStart() {
  let firstTime = parseInt(localStorage.getItem('numberOfGames'))
  if(isNaN(firstTime)) {
    localStorage.setItem('numberOfGames', '0')
    localStorage.setItem('numberOfVictories', '0')
    localStorage.setItem('numberOfFails', '0')
    
  } 
}
//   começa a interação com o usuário
function startInteraction() {
    document.addEventListener('click', handleMouseClick)
    document.addEventListener('keydown', handleKeyPress)
}
// interrompe a interação com o usuário
function stopInteraction() {
    document.removeEventListener('click', handleMouseClick)
    document.removeEventListener('keydown', handleKeyPress)
}

//   Click com o mouse
function handleMouseClick(e) {
    if (e.target.matches('[data-key]')) {
        pressKey(e.target.dataset.key)
        return
    }

    if (e.target.matches('[data-enter]')) {
        submitGuess()
        return
    }

    if (e.target.matches('[data-delete]')) {
        deleteKey()
        return
    }
}
// Entrada pelo teclado
function handleKeyPress(e) {
    if (e.key === 'Enter') {
    submitGuess()
    return
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
        deleteKey()
        return
    }

    if (e.key.match(/^[A-Z]$/) || e.key.match(/^[a-z]/)) {
        pressKey(e.key)
        return
    }
}

function pressKey(key) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= WORD_LENGTH) return
    const nextTile = guessGrid.querySelector('.tile:not([data-letter])') //seleciona o primeiro elemneto sem o data-letter
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key //adiciona o conteudo  na div
    nextTile.dataset.state = 'active'
}

function deleteKey() {
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length - 1]
    if (lastTile == null) return
    lastTile.textContent = ''
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
}

function submitGuess() {
    numberOfTries++
    
    const activeTiles = [...getActiveTiles()]
    if (activeTiles.length !== WORD_LENGTH) { 
        showAlert('Not enough letters')
    shakeTiles(activeTiles)    
    return }

    const guess = activeTiles.reduce((word, tile) => {

        return word + tile.dataset.letter
    }, "")

    if (!dictionary.includes(guess)) {
        showAlert('Not in word list')
        shakeTiles(activeTiles)
        return
    }

    stopInteraction()
    activeTiles.forEach((...params) => flipTile(...params, guess));
    
    temp = "";
}

function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter;
    const key = keyboard.querySelector(`[data-key="${letter}"i]`);
    setTimeout(() => {
        tile.classList.add("flip");
    }, (index * FLIP_ANIMATION_DURATION) / 2);

    tile.addEventListener(
        "transitionend",
        () => {
        tile.classList.remove("flip");
        if (targetWord[index] == letter) {
            temp += letter;
            tile.dataset.state = "correct";
            key.classList.add("correct");
        } 
        else if (targetWord.includes(letter)) {
            if (temp.split(letter).length < targetWord.split(letter).length) {
            tile.dataset.state = "wrong-position";
            key.classList.add("wrong-position");
            temp += letter;
            } 
            else {
            tile.dataset.state = "wrong";
            key.classList.add("wrong");
            }
        } 
        else {
            tile.dataset.state = "wrong";
            key.classList.add("wrong");
        }
        
        if (index === array.length - 1) {
            tile.addEventListener('transitionend', () => {
                startInteraction()
                checkWinLose(guess, array)
            }, {once:true})
        }
        },{ once: true }
    );
}

function showAlert(message, duration = 1000) {
    const alert =document.createElement('div')
    alert.textContent = message
    alert.classList.add('alert')
    alertContainer.prepend(alert)
    if (duration == null) return

    setTimeout(() => {
        alert.classList.add('alert-hide')
        alert.addEventListener('transitionend', () => {
            alert.remove()
        })
    },duration)
}

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
}

function shakeTiles(tiles) {
    tiles.forEach(tile => {
        tile.classList.add('shake')
        tile.addEventListener('animationend', () => {
            tile.classList.remove('shake')
        }, {once: true})
    });
}

function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
      localStorage.setItem('numberOfVictories', (numberOfVictories + 1).toString())
      danceTiles(tiles)
      setTimeout(() => {
          modals[4].showModal()
          modals[4].classList.add('modal-open')
          tries.textContent = `You guessed the word in ${numberOfTries} tries`
        }, 500) 
        stopInteraction()
        return
    }

    const remainingTiles = guessGrid.querySelectorAll('.tile:not([data-letter])')
    
    if (remainingTiles.length === 0) {
      shakeTiles(guessGrid.querySelectorAll('.tile'))
      modals[3].showModal()
      modals[3].classList.add('modal-open')
      answer.innerHTML = `The word was: ${targetWord.toUpperCase()}`
      localStorage.setItem('numberOfFails', (numberOfFails + 1).toString())
      stopInteraction()
    }
}

function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('dance')
            tile.addEventListener('animationend', () => {
                tile.classList.remove('dance')
            }, {once:true}
            )
        }, index * DANCE_ANIMATION_DURATION / 5)
    })
}


// Assets ----------------------------------------------------->

// Mobile Menu
const menuToggle = document.querySelector('.menu-toggle')
const primaryNav = document.querySelector('#primary-navigation')

menuToggle.addEventListener('click', () => {
    const visibility = primaryNav.getAttribute('data-visible')

    if (visibility === 'false') {
        primaryNav.setAttribute('data-visible', true)
        menuToggle.setAttribute('aria-expanded', true)
    } else {
        primaryNav.setAttribute('data-visible', false)
        menuToggle.setAttribute('aria-expanded', false)
    }

})

// Modal Toggle

const modals = document.querySelectorAll('[data-modal]')
const menuButton = document.querySelectorAll('[data-menu-button]')
const closeButton = document.querySelectorAll('[data-close-button]')

menuButton.forEach(button => {
    let btnId = button.getAttribute('data-menu-button')
    button.addEventListener('click', () => {
        modals[btnId].showModal()
        modals[btnId].classList.add('modal-open')
    })
})

closeButton.forEach(button => {
  let btnId = button.getAttribute('data-close-button')  
  button.addEventListener('click', () => {
    modals[btnId].close()
    modals[btnId].classList.remove('modal-open')
  })
})

// Dark Mode
let darkMode = localStorage.getItem('darkMode')
const darkModeToggle = document.querySelector('#dark-mode-toggle')

function enableDarkMode() {
    darkModeToggle.setAttribute('data-dark-mode', 'enabled')
    document.body.setAttribute('data-dark-mode', 'enabled')
    localStorage.setItem('darkMode', 'enabled')
}

function disableDarkMode() {
    darkModeToggle.setAttribute('data-dark-mode', 'disabled')
    document.body.setAttribute('data-dark-mode', 'disabled')
    localStorage.setItem('darkMode', 'disabled')
}

// check the inicial state of darkMode, if one isn't present, set to dark mode
if (darkMode === 'enabled'|| darkMode == null) {
    enableDarkMode()
} else {
    disableDarkMode()
}

darkModeToggle.addEventListener('click', () => {
   darkMode = localStorage.getItem('darkMode')
    if(darkMode !== 'enabled'){
        enableDarkMode()
        
    } 
    else {
        disableDarkMode()
        
    }
})

// Give Up

const giveUp = document.querySelector('[data-give-up]')
const answer = document.querySelector('[data-answer]')

giveUp.addEventListener('click', () => {
    localStorage.setItem('numberOfFails', (numberOfFails + 1).toString())
    modals[3].showModal()
    modals[3].classList.add('modal-open')
    answer.innerHTML = `The word was: ${targetWord.toUpperCase()}`
})

// Restart
const restart = document.querySelectorAll('[data-restart]')

restart.forEach(button => {
    button.addEventListener('click', () => {
        window.location.reload()
    })
}) 
    
// Stats

const stats = document.querySelectorAll('[data-stats]')

stats[0].innerHTML = `<p>Games Played: <span class="total-games">${numberOfGames}</span></p>`
stats[1].innerHTML = `<p>Correct Guesses: <span class="number-victories">${numberOfVictories}</span></p>`
stats[2].innerHTML = `<p>Number of Losses: <span class="number-losses">${numberOfFails}</span></p>`