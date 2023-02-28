firstTimeStart()
let language = localStorage.getItem('language')
const guessGrid = document.querySelector('[data-guess-grid]')
const alertContainer = document.querySelector('[data-alert-container]')
const keyboard = document.querySelector('[data-keyboard]')
const tries = document.querySelector('[data-tries]')
const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
let numberOfTries = 0
let dictionary = setDictionary(language)
let targetWords = setTargetWords(language)
// encontra um apalavra aleatória
const randomIndex = Math.floor(Math.random() * targetWords.length) //seleciona um index aleatório
const randomWord = targetWords[randomIndex] //seleciona uma palavra na lista usando o index
const targetWord = randomWord

console.log(targetWord);
// seleciona os stats do local storage
let numberOfGames = parseInt(localStorage.getItem('numberOfGames'))
let numberOfVictories = parseInt(localStorage.getItem('numberOfVictories'))
let numberOfFails = parseInt(localStorage.getItem('numberOfFails'))

startInteraction()

// determina o dicionario a ser usado
function setDictionary(language) {
    if (language == 'pt-br') {
        return ptDictionary
        
        
    } else {
        return engDictionary 
    }
}
// determina a lista de palavras alvo a ser usada
function setTargetWords(language) {
    if (language == 'pt-br') {
        return ptTargetWords    
    } else {
           return engTargetWords
    }
}

// Checa se é a primeira vez jogando e atribui as variáveis numéricas
function firstTimeStart() {
  let firstTime = parseInt(localStorage.getItem('numberOfGames'))
  if(isNaN(firstTime)) {
    localStorage.setItem('numberOfGames', '0')
    localStorage.setItem('numberOfVictories', '0')
    localStorage.setItem('numberOfFails', '0')
    
  } 
  let language = localStorage.getItem('language')
  if(language == null){
    localStorage.setItem('language', 'pt-br')
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
// imprime a letra na tela
function pressKey(key) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= WORD_LENGTH) return
    const nextTile = guessGrid.querySelector('.tile:not([data-letter])') //seleciona o primeiro elemento sem o data-letter
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key //adiciona o conteudo  na div
    nextTile.dataset.state = 'active'
    nextTile.classList.add('bounce')
    nextTile.addEventListener('animationend', () => {
        nextTile.classList.remove('bounce')
    })
}
// deleta a ultima letra
function deleteKey() {
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length - 1]
    if (lastTile == null) return
    lastTile.textContent = ''
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
}
// faz o check da tentativa
function submitGuess() {
    
    const activeTiles = [...getActiveTiles()]
    if (activeTiles.length !== WORD_LENGTH) { 
        if(language == 'pt-br'){
            showAlert('Letras insuficientes')
        } else {
            showAlert('Not enough letters')
        }
    shakeTiles(activeTiles)    
    return }

    const guess = activeTiles.reduce((word, tile) => {

        return word + tile.dataset.letter
    }, "")

    if (!dictionary.includes(guess)) {
        if(language == 'pt-br'){
            showAlert('Palavra não existe')
        } else {
            showAlert('Not in word list')
        }
        shakeTiles(activeTiles)
        return
    }
    numberOfTries++
    stopInteraction()
    flips = mapTiles(guess)
    activeTiles.forEach((...params) => flipTile(...params, guess, flips));
}

function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter;
    const key = keyboard.querySelector(`[data-key="${letter}"i]`);
    const status = flips.charAt(index)

    setTimeout(() => {
        tile.classList.add("flip");
    }, (index * FLIP_ANIMATION_DURATION) / 2);

    tile.addEventListener(
        "transitionend",
        () => {
        tile.classList.remove("flip");
        if (status === 'c') {
            tile.dataset.state = "correct";
            key.classList.add("correct");
        } 
        else if (status === 'p') {
            tile.dataset.state = "wrong-position";
            key.classList.add("wrong-position");    
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
// faz um map da palavra alvo e o guess e compara aas duas retornando uma string
function mapTiles(guess) {
    // numero de vezes que cada letra aparece na palavra
    let targetMap = [...targetWord].reduce((res, char) => (res[char] = (res[char] || 0) +1, res), {})

    // letras na posição correta
    let map2 = ''
    for(i = 0; i < guess.length; i++) {
        var c = guess.charAt(i)
        if (c === targetWord.charAt(i)) {
            map2 += 'c'
            targetMap[c] -= 1
        } else {
            map2 += 'i'
        }
    }

    // letras na posição incorreta
    var map3 = ""
    for(i = 0; i < map2.length; i++) {
        var f = map2.charAt(i)
        if (f === 'i') {
            var c = guess.charAt(i)
            if (targetMap.hasOwnProperty(c) && (targetMap[c] > 0)) {
                targetMap[c] -=1
                f ='p'
            }
        }
        map3 += f
    }
        console.log(targetMap);
        console.log(map2);
        console.log(map3)    
    return map3
}

function showAlert(message, duration = 1000) {
    const alert = document.createElement('div')
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
// seleciona as tiles ativas
function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
}
// animação de erro
function shakeTiles(tiles) {
    tiles.forEach(tile => {
        tile.classList.add('shake')
        tile.addEventListener('animationend', () => {
            tile.classList.remove('shake')
        }, {once: true})
    });
}
// checa vitória / derrota
function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
        localStorage.setItem('numberOfGames', (numberOfGames + 1).toString())
      localStorage.setItem('numberOfVictories', (numberOfVictories + 1).toString())
      danceTiles(tiles)
      setTimeout(() => {
        modals[4].showModal()
        modals[4].classList.add('modal-open')
        if(language == 'pt-br'){
            if (numberOfTries == 1){
                tries.textContent = `Você acertou a palavra em ${numberOfTries} tentativa`
            } else {
                tries.textContent = `Você acertou a palavra em ${numberOfTries} tentativas`
            }
        } else {
            if (numberOfTries == 1) {
                tries.textContent = `You guessed the word in ${numberOfTries} try`
            } else {
                tries.textContent = `You guessed the word in ${numberOfTries} tries`
            }
        }
          
        }, 500) 
        stopInteraction()
        return
    }

    const remainingTiles = guessGrid.querySelectorAll('.tile:not([data-letter])')
    
    if (remainingTiles.length === 0) {
        localStorage.setItem('numberOfGames', (numberOfGames + 1).toString())
      shakeTiles(guessGrid.querySelectorAll('.tile'))
      modals[3].showModal()
      modals[3].classList.add('modal-open')
      
      localStorage.setItem('numberOfFails', (numberOfFails + 1).toString())
      stopInteraction()
    }
}
// animação de vitória
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
    darkModeToggle.setAttribute('data-function', 'enabled')
    document.body.setAttribute('data-dark-mode', 'enabled')
    localStorage.setItem('darkMode', 'enabled')
}

function disableDarkMode() {
    darkModeToggle.setAttribute('data-function', 'disabled')
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
    localStorage.setItem('numberOfGames', (numberOfGames + 1).toString())
    localStorage.setItem('numberOfFails', (numberOfFails + 1).toString())
    modals[3].showModal()
    modals[3].classList.add('modal-open')
})

// Restart
const restart = document.querySelectorAll('[data-restart]')

restart.forEach(button => {
    button.addEventListener('click', () => {
        window.location.reload()
    })
}) 
    
// Stats



