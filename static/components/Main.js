import Game from "./Game.js"
import Net from "./Net.js"
import Ui from "./Ui.js"

let game
let net
let ui

window.onload = () => {
    game = new Game()
    net = new Net()
    ui = new Ui()
    ui.loginButtonClick(net, game, ui)
    ui.resetButtonClick(net)

    window.addEventListener('resize', () => game.resize())
    window.addEventListener('mousedown', (e) => game.pionekKlik(e))
}