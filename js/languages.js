const keyboardRow = document.querySelectorAll('.keyboard-row')
language = localStorage.getItem('language')
const çBtn = document.querySelector('[data-key="ç"]')
const langToggleBtn = document.querySelector('#language-toggle')
const helpText = document.querySelector('[data-text="help"]')
const stats = document.querySelectorAll('[data-stats]')
const configsText = document.querySelectorAll('[data-config-text]')
const helpBtnText = document.querySelector('[data-text="help-btn"]')
const giveUpText = document.querySelector('[data-text="give-up"]')
const gameOverText = document.querySelector('[data-text="game-over"]')
const gameWinText = document.querySelector('[data-text="game-win"]')




if (language == 'pt-br'){
    langPtBr()
    showAlert('Consegue advinhar a palavra?', duration = 1500)
    langToggleBtn.dataset.function = 'enabled'
} else {
    langEng()
    showAlert('Can you guess the word?', duration = 1500)
    langToggleBtn.dataset.function = 'disabled'
}



// language toggle
langToggleBtn.addEventListener('click', () => {
    language = localStorage.getItem('language')
    if (language == 'pt-br') {   
        localStorage.setItem('language', 'eng-us')
        langToggleBtn.dataset.function = 'disabled'
        window.location.reload()
    } else {
        localStorage.setItem('language', 'pt-br')
        langToggleBtn.dataset.function = 'enabled'
        window.location.reload()
    }
})

function langEng() {
    
    // Esconde o Botão do Ç
    çBtn.classList.add('btn-hidden')

    //help text
    helpText.innerHTML = 
    `<h2 class="modal-title">How to Play</h2>
    <p>You have 6 tries to guess the word</p>
    <p>After each try you'll get a tip with colors</p>
    <p>Exemple:</p>
    <div class="exemple
    "> <span class="help-exemple correct">P</span>
        <span data-state="wrong" class="help-exemple">L</span>
        <span class="help-exemple wrong-position">A</span>
        <span data-state="wrong" class="help-exemple">N</span>
        <span data-state="wrong" class="help-exemple">E</span>
    </div>
    <p> If the letter is correct, it will turn <span class="green-text">Green</span></p>
    <p>If the letter is elsewhere on the word, it will turn <span class="yellow-text">Yellow</span></p>
    <p>If the letter isn't on the word, it will turn <span class="grey-text">Grey</span></p>
    
    <p>If you want to give up, just press  <button class="help-give-up">Surrender</button></p>`

    // Stats

    stats[0].innerHTML = `<p>Games Played: <span class="total-games">${numberOfGames}</span></p>`
    stats[1].innerHTML = `<p>Correct Guesses: <span class="number-victories">${numberOfVictories}</span></p>`
    stats[2].innerHTML = `<p>Number of Losses: <span class="number-losses">${numberOfFails}</span></p>`

    // Configs

    configsText[0].innerHTML = 
    `<h3>Dark Mode</h3>
    <p>Toggle dark mode on/off</p>`
    configsText[1].innerHTML = 
    `<h3>Language</h3>
    <p>Switch between Portuguese/English</p>`

    // Help Button
    helpBtnText.textContent = 'Help'

    // Give Up
    giveUpText.textContent = 'Surrender'

    // Resposta
    answer.innerHTML = `The word was: ${targetWord.toUpperCase()}`

    // game over
    gameOverText.textContent = 'Game Over'

    // game win
    gameWinText.textContent= 'You Win!'

    // restart
    restart.forEach(button => {
        button.textContent = 'Play Again'
    })


}

function langPtBr() {
    
    // Mostra o botão Ç
    çBtn.classList.remove('btn-hidden')
  

    // Help Text

    helpText.innerHTML = 
    `<h2 class="modal-title">Como Jogar</h2>
    <p>Você tem 6 tentativas para acetar a palavra</p>
    <p>Depois de cada tentativa as cores te darão uma dica</p>
    <p>Exemplo:</p>
    <div class="exemple
    "> <span class="help-exemple correct">A</span>
        <span data-state="wrong" class="help-exemple">V</span>
        <span class="help-exemple wrong-position">I</span>
        <span data-state="wrong" class="help-exemple">A</span>
        <span data-state="wrong" class="help-exemple">O</span>
    </div>
    <p> Se a letra estiver correta, ela ficará <span class="green-text">Verde</span></p>
    <p>Se a letra estiver em outro lugar na palavra, ela ficará <span class="yellow-text">Amarela</span></p>
    <p>Se a letra não existir na palavra, ela ficará <span class="grey-text">Cinza</span></p>
    
    <p>Se quiser desistir, aperte o botão  <button class="help-give-up">Me rendo</button></p>`

    // Stats

    stats[0].innerHTML = `<p>Partidas Jogadas: <span class="total-games">${numberOfGames}</span></p>`
    stats[1].innerHTML = `<p>Palpites Certos: <span class="number-victories">${numberOfVictories}</span></p>`
    stats[2].innerHTML = `<p>Número de Derrotas: <span class="number-losses">${numberOfFails}</span></p>`

    // Configs

    configsText[0].innerHTML = 
    `<h3>Modo Escuro</h3>
    <p>Liga/Desliga o modo escuro</p>`
    configsText[1].innerHTML = 
    `<h3>Linguagem</h3>
    <p>Muda entre Português/Inglês</p>`

    // Help Button
    helpBtnText.textContent = 'Ajuda'

    // Give Up
    giveUpText.textContent = 'Me rendo'

    // Resposta
    answer.innerHTML = `A palavra era: ${targetWord.toUpperCase()}`

    // game over
    gameOverText.textContent = 'Fim de Jogo!'

    // game win
    gameWinText.textContent= 'Você Venceu!'

    // restart
    restart.forEach(button => {
        button.textContent = 'Jogar Novamente'
    })

}
