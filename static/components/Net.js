class Net {
    queens = (queensTab) => {
        const headers = { "Content-Type": "application/json" }
        const body = JSON.stringify({ queensTab: queensTab })
        fetch(`/queensTab`, { method: "post", body, headers })
            .then(response => response.json())
            .then(data => { })
    }
    resetFunction = () => {
        const headers = { "Content-Type": "application/json" }
        fetch(`/clearUserTab`, { method: "post", headers })
            .then(response => response.json())
            .then(data => { })
    }
    waitForEndGame = (game, ui) => {
        const myInterval = setInterval(interval, 1000)
        const headers = { "Content-Type": "application/json" }
        function interval() {
            fetch(`/isEndGame`, { method: "post", headers })
                .then(response => response.json())
                .then(data => {
                    if (data != "") {
                        if (data == game.color) {
                            ui.endGameWin()
                            fetch(`/clearUserTab`, { method: "post", headers })
                                .then(response => response.json())
                                .then(data => { })
                        } else
                            ui.endGameLose()
                        clearInterval(myInterval)
                    }
                })
        }
    }
    fetchFunction = (game, ui) => {
        this.waitForEndGame(game, ui)
        this.fetchFunctionPionekMoveGet(game, ui)
        let userName = document.getElementById("inputLogin").value
        let body = JSON.stringify({ userName: userName })
        const headers = { "Content-Type": "application/json" }
        interval()
        let i = 0
        function interval() {
            fetch("/addUser", { method: "post", body, headers })
                .then(response => response.json())
                .then(
                    data => {
                        if (data == "") {
                            ui.sameLogin()
                        } else {
                            if (data.length == 1 || data.length == 2) {
                                if (data.length == 1) {
                                    userName = true
                                    body = JSON.stringify({ userName: userName })
                                    game.setColor("white")
                                    if (i == 0)
                                        ui.waitForSecondPlayer()
                                    setInterval(interval(), 500)
                                    i++
                                } else {
                                    game.addPionki()
                                    ui.addUser()
                                    if (game.color != "white") {
                                        ui.topText(data[1], 2, data[0])
                                        game.changeCamera()
                                        ui.setFirstClock()
                                    } else {
                                        ui.topText(data[0], 1, data[1])
                                    }
                                }
                            } else {
                                ui.toMuchUsers()
                            }
                        }
                    }
                )
        }
    }
    fetchFunctionPionekMove = (pionekMove, bityPionek) => {
        const body = JSON.stringify({
            color: pionekMove.color,
            pionek: pionekMove.pionek,
            newPositionX: pionekMove.newPositionX,
            newPositionY: pionekMove.newPositionY,
            newPositionZ: pionekMove.newPositionZ,
            bityPionek: bityPionek.position
        })
        const headers = { "Content-Type": "application/json" }
        fetch("/pionekMove", { method: "post", body, headers })
            .then(response => response.json())
            .then(data => { })
    }
    endGame = (color) => {
        const body = JSON.stringify({ color: color })
        const headers = { "Content-Type": "application/json" }
        fetch(`/endGame`, { method: "post", body, headers })
            .then(response => response.json())
            .then(data => { })
    }
    fetchFunctionPionekMoveGet = (game, ui) => {
        setInterval(interval, 1000)
        let i = 30
        function interval() {
            const body = JSON.stringify({ ok: "ok" })
            const headers = { "Content-Type": "application/json" }
            fetch(`/queensTab`, { method: "post", headers })
                .then(response => response.json())
                .then(d => {
                    if (d.queensTab.length > 0)
                        game.setQueensTab(d.queensTab)
                })
            fetch(`/getMove`, { method: "post", body, headers })
                .then(response => response.json())
                .then(data => {
                    if (data != "") {
                        game.opponentMove(data)
                        game.whoseTurn(data.color)
                        if (!game.yourTurn) {
                            ui.setClock(i)
                            if (i > 0)
                                i--
                            else {
                                const body = JSON.stringify({ color: game.color })
                                const headers = { "Content-Type": "application/json" }
                                fetch(`/endGame`, { method: "post", body, headers })
                                    .then(response => response.json())
                                    .then(data => { })
                            }
                        } else {
                            ui.deleteClock()
                            i = 30
                        }
                    }
                })
        }
    }
}
export default Net