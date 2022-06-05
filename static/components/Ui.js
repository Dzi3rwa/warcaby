class Ui {
    loginButtonClick = (net, game, ui) => {
        document.getElementById("buttonLogin").addEventListener("click", function () {
            net.fetchFunction(game, ui)
            game.getObjects(game, ui, net)
        })
    }
    resetButtonClick = (net) => {
        document.getElementById("buttonReset").addEventListener("click", function () {
            net.resetFunction()
        })
    }
    addUser = () => {
        const loginDiv = document.getElementById("login")
        loginDiv.remove()
    }
    toMuchUsers = () => {
        const loginDiv = document.getElementById("login")
        loginDiv.innerHTML = "Brak możliwości zalogowania! Zbyt duża liczba graczy!"
        loginDiv.style.border = "none"
        loginDiv.style.fontSize = "80px"
    }
    topText = (nick, i, secondPlayer) => {
        const topDiv = document.getElementById("top")
        if (i == 1)
            topDiv.innerHTML = `Witaj ${nick}, grasz białymi <br/> Grasz przeciwko: ${secondPlayer}`
        else
            topDiv.innerHTML = `Witaj ${nick}, grasz czarnymi <br/> Grasz przeciwko: ${secondPlayer}`
        topDiv.style.fontFamily = "Arial"
        topDiv.style.fontSize = "30px"
        topDiv.style.color = "white"
    }
    sameLogin = () => {
        const topDiv = document.getElementById("top")
        topDiv.innerHTML = `Taki login już istnieje`
        topDiv.style.fontFamily = "Arial"
        topDiv.style.fontSize = "30px"
        topDiv.style.color = "white"
    }
    waitForSecondPlayer = () => {
        const loginDiv = document.getElementById("login")
        loginDiv.innerHTML = "Czekaj na drugiego gracza..."
        loginDiv.style.border = "none"
        loginDiv.style.fontSize = "80px"
        const load = document.createElement("div")
        load.classList.add("load")
        loginDiv.appendChild(load)
    }
    setFirstClock = () => {
        const clockDiv = document.getElementById("clockDiv")
        clockDiv.style.visibility = "visible"
    }
    setClock = (i) => {
        const clockDiv = document.getElementById("clockDiv")
        clockDiv.style.visibility = "visible"
        const clock = document.getElementById("clock")
        clock.style.fontSize = "200px"
        clock.innerHTML = i
    }
    deleteClock = () => {
        const clockDiv = document.getElementById("clockDiv")
        clockDiv.style.visibility = "hidden"
    }
    endGameWin = () => {
        const clockDiv = document.getElementById("clockDiv")
        clockDiv.remove()
        const win = document.getElementById("win")
        win.style.visibility = "visible"
    }
    endGameLose = () => {
        const clockDiv = document.getElementById("clockDiv")
        clockDiv.remove()
        const lose = document.getElementById("lose")
        lose.style.visibility = "visible"
    }
}
export default Ui