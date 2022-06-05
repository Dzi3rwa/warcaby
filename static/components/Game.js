import Pionek from '../mesh/Pionek.js'
import Item from '../mesh/Item.js';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 70, 100)
        this.camera.lookAt(this.scene.position)
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x181818);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);
        this.color = "black"
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()
        this.bool = false
        this.activePionek = ""
        this.klikBool = false
        this.szachownica = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ]
        this.pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ]

        this.game
        this.ui
        this.net
        this.opponent = false
        this.opponentObject
        this.yourTurn = false
        this.plansza1
        this.plansza2
        this.bicie1 = 0
        this.bicie2 = 0
        this.opponentBicie = false
        this.iloscPionkow = 8
        this.queensTab = []
        this.planszaQueen = []
        this.biciePlanszeQueen = []
        this.bicieQueen = []
        this.opponetBicieObject
        this.counter = 0

        this.addSzachownica()
        this.render()
    }



    //render
    render = () => {
        TWEEN.update()
        if (this.yourTurn) {
            if (this.bool) {
                this.bool = false
                this.intersects = this.raycaster.intersectObjects(this.scene.children);
                if (this.intersects.length > 0 && this.activePionek.name == `pionek-${this.color}`) {
                    if (this.intersects[0].object == this.plansza1 || this.intersects[0].object == this.plansza2 || this.biciePlanszeQueen.includes(this.intersects[0].object) || this.planszaQueen.includes(this.intersects[0].object) && ((this.plansza1 != undefined && this.plansza1.id < 74) || (this.plansza2 != undefined && this.plansza2.id < 74) || (this.planszaQueen.includes(this.intersects[0].object) != undefined) || (this.biciePlanszeQueen.includes(this.intersects[0].object) != undefined))) {
                        this.x = this.intersects[0].object.position.x
                        this.y = this.intersects[0].object.position.y + 1
                        this.z = this.intersects[0].object.position.z
                        this.ok = false
                        const [x, y, z] = this.activePionek.position
                        const pionekMove = {
                            color: this.color,
                            pionek: { x: x, y: y, z: z },
                            newPositionX: this.x,
                            newPositionY: this.y,
                            newPositionZ: this.z,
                        }
                        let bityPionek = {}
                        if (this.bicie1 != 0 && this.intersects[0].object == this.plansza1) {
                            const [x, y, z] = this.bicie1.position
                            bityPionek = { position: { x: x, y: y, z: z } }
                            this.scene.remove(this.bicie1)
                            if (this.iloscPionkow > 0)
                                this.iloscPionkow--
                            this.bicie1 = 0
                        } else if (this.bicie2 != 0 && this.intersects[0].object == this.plansza2) {
                            const [x, y, z] = this.bicie2.position
                            bityPionek = { position: { x: x, y: y, z: z } }
                            this.scene.remove(this.bicie2)
                            if (this.iloscPionkow > 0)
                                this.iloscPionkow--
                            this.bicie2 = 0
                        } else if (this.biciePlanszeQueen.includes(this.intersects[0].object)) {
                            const index = this.biciePlanszeQueen.indexOf(this.intersects[0].object)
                            const bicie = this.bicieQueen[index]
                            const [x, y, z] = bicie.position
                            bityPionek = { position: { x: x, y: y, z: z } }
                            this.scene.remove(bicie)
                            if (this.iloscPionkow > 0)
                                this.iloscPionkow--
                        }
                        this.bicieQueen.length = 0
                        console.log(this.iloscPionkow)
                        for (let i = 64; i < this.scene.children.length; i++) {
                            if (this.scene.children[i].position.x == this.x && this.scene.children[i].position.y == this.y && this.scene.children[i].position.z == this.z) {
                                this.ok = true
                            }
                        }
                        if (!this.ok) {
                            const tween = new TWEEN.Tween(this.activePionek.position)
                                .to({ x: this.x, y: this.y, z: this.z }, 300)
                                .onComplete(() => {
                                    this.net.fetchFunctionPionekMove(pionekMove, bityPionek)

                                    if (this.color == "black")
                                        this.activePionek.material.color.setHex(0x000000)
                                    else
                                        this.activePionek.material.color.setHex(0xffffff)
                                    if (this.plansza1 != undefined && this.plansza1.name != "pionek-white" && this.plansza1.name != "pionek-black")
                                        this.plansza1.material.color.setHex(0x654321)
                                    if (this.plansza2 != undefined && this.plansza2.name != "pionek-white" && this.plansza2.name != "pionek-black")
                                        this.plansza2.material.color.setHex(0x654321)

                                    //queen
                                    if (this.activePionek.name == "pionek-white" && this.activePionek.position.z == -35) {
                                        this.queensTab.push(this.activePionek)
                                        this.net.queens(this.activePionek.id)
                                    } else if (this.activePionek.name == "pionek-black" && this.activePionek.position.z == 35) {
                                        this.queensTab.push(this.activePionek)
                                        this.net.queens(this.activePionek.id)
                                    }
                                    this.queensTab.forEach(e => {
                                        e.material.opacity = 0.5
                                    })
                                    this.planszaQueen.forEach(e => {
                                        e.material.color.setHex(0x654321)
                                    })
                                    this.biciePlanszeQueen.forEach(e => {
                                        e.material.color.setHex(0x654321)
                                    })
                                    if (this.iloscPionkow == 0)
                                        this.net.endGame(this.color)
                                })
                            tween.start()
                        }
                    }
                }
                if (this.intersects.length > 0 && this.intersects[0].object.name == `pionek-${this.color}`) {
                    if (this.klikBool && this.activePionek != "") {
                        if (this.color == "black") {
                            this.activePionek.material.color.setHex(0x000000)
                        } else {
                            this.activePionek.material.color.setHex(0xffffff)
                        }
                        this.queensTab.forEach(e => {
                            e.material.opacity = 0.5
                        })

                        if (this.plansza1 != undefined && this.plansza1.name != "pionek-white" && this.plansza1.name != "pionek-black") {
                            this.plansza1.material.color.setHex(0x654321)
                            this.plansza1 = undefined
                            this.bicie1 = 0
                            this.bicie2 = 0
                            this.bicieQueen.length = 0
                        }
                        if (this.plansza2 != undefined && this.plansza2.name != "pionek-white" && this.plansza2.name != "pionek-black") {
                            this.plansza2.material.color.setHex(0x654321)
                            this.plansza2 = undefined
                            this.bicie1 = 0
                            this.bicie2 = 0
                            this.bicieQueen.length = 0
                        }
                        this.planszaQueen.forEach(e => {
                            e.material.color.setHex(0x654321)
                        })
                        this.biciePlanszeQueen.forEach(e => {
                            e.material.color.setHex(0x654321)
                        })
                    }
                    this.intersects[0].object.material.color.setHex(0xffff00)
                    this.activePionek = this.intersects[0].object
                    this.klikBool = false
                    this.id = 0
                    for (let i = 0; i < 64; i++) {
                        if (this.scene.children[i].position.x == this.activePionek.position.x && this.scene.children[i].position.y == this.activePionek.position.y - 1 && this.scene.children[i].position.z == this.activePionek.position.z) {
                            this.id = i
                        }
                    }

                    //queen bicie

                    this.planszaQueen.length = 0
                    this.biciePlanszeQueen.length = 0
                    this.boolQueen1 = false
                    this.boolQueen2 = false
                    this.boolQueen3 = false
                    this.boolQueen4 = false
                    this.boolQueen11 = false
                    this.boolQueen22 = false
                    this.boolQueen33 = false
                    this.boolQueen44 = false
                    this.boolQueen51 = false
                    this.boolQueen52 = false
                    this.boolQueen53 = false
                    this.boolQueen54 = false
                    this.boolQueen61 = false
                    this.boolQueen62 = false
                    this.boolQueen63 = false
                    this.boolQueen64 = false

                    if (this.queensTab.includes(this.activePionek)) {
                        for (let i = 1; i < 8; i++) {
                            if (this.scene.children[this.id + (i * 7)] != undefined && this.scene.children[this.id + (i * 7)].name != "pionek-white" && this.scene.children[this.id + (i * 7)].name != "pionek-black" && this.scene.children[this.id + (i * 7)].name != "plansza-white") {
                                this.sameColor
                                for (let j = 64; j < this.scene.children.length; j++) {
                                    if (this.scene.children[this.id + (i * 7)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id + (i * 7)].position.x && this.scene.children[j].position.z == this.scene.children[this.id + (i * 7)].position.z) {
                                        this.boolQueen1 = true
                                        this.sameColor = this.scene.children[j]
                                        break
                                    }
                                }
                                if (!this.boolQueen1)
                                    this.planszaQueen.push(this.scene.children[this.id + (i * 7)])
                                else if (!this.boolQueen11 && this.scene.children[this.id + ((i + 1) * 7)] != undefined && this.scene.children[this.id + ((i + 1) * 7)].name != "pionek-white" && this.scene.children[this.id + ((i + 1) * 7)].name != "pionek-black" && this.scene.children[this.id + ((i + 1) * 7)].name != "plansza-white") {
                                    if (this.color == "black") {
                                        if (this.sameColor.name == "pionek-black")
                                            this.boolQueen51 = true
                                    } else {
                                        if (this.sameColor.name == "pionek-white")
                                            this.boolQueen51 = true
                                    }
                                    if (!this.boolQueen51) {
                                        for (let j = 64; j < this.scene.children.length; j++) {
                                            if (this.scene.children[this.id + ((i + 1) * 7)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id + ((i + 1) * 7)].position.x && this.scene.children[j].position.z == this.scene.children[this.id + ((i + 1) * 7)].position.z) {
                                                this.boolQueen61 = true
                                                break
                                            }
                                        }
                                        if (!this.boolQueen61) {
                                            this.biciePlanszeQueen.push(this.scene.children[this.id + ((i + 1) * 7)])
                                            for (let j = 64; j < this.scene.children.length; j++) {
                                                if (this.scene.children[this.id + (i * 7)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id + (i * 7)].position.x && this.scene.children[j].position.z == this.scene.children[this.id + (i * 7)].position.z) {
                                                    this.bicieQueen.push(this.scene.children[j])
                                                    break
                                                }
                                            }
                                            this.boolQueen11 = true
                                        }
                                    }
                                }
                            }
                            if (this.scene.children[this.id - (i * 9)] != undefined && this.scene.children[this.id - (i * 9)].name != "pionek-white" && this.scene.children[this.id - (i * 9)].name != "pionek-black" && this.scene.children[this.id - (i * 9)].name != "plansza-white") {
                                this.sameColor
                                for (let j = 64; j < this.scene.children.length; j++) {
                                    if (this.scene.children[this.id - (i * 9)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id - (i * 9)].position.x && this.scene.children[j].position.z == this.scene.children[this.id - (i * 9)].position.z) {
                                        this.boolQueen2 = true
                                        this.sameColor = this.scene.children[j]
                                        break
                                    }
                                }
                                if (!this.boolQueen2)
                                    this.planszaQueen.push(this.scene.children[this.id - (i * 9)])
                                else if (!this.boolQueen22 && this.scene.children[this.id - ((i + 1) * 9)] != undefined && this.scene.children[this.id - ((i + 1) * 9)].name != "pionek-white" && this.scene.children[this.id - ((i + 1) * 9)].name != "pionek-black" && this.scene.children[this.id - ((i + 1) * 9)].name != "plansza-white") {
                                    if (this.color == "black") {
                                        if (this.sameColor.name == "pionek-black")
                                            this.boolQueen52 = true
                                    } else {
                                        if (this.sameColor.name == "pionek-white")
                                            this.boolQueen52 = true
                                    }
                                    if (!this.boolQueen52) {
                                        for (let j = 64; j < this.scene.children.length; j++) {
                                            if (this.scene.children[this.id + ((i - 1) * 9)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id - ((i + 1) * 9)].position.x && this.scene.children[j].position.z == this.scene.children[this.id - ((i + 1) * 9)].position.z) {
                                                this.boolQueen62 = true
                                                break
                                            }
                                        }
                                        if (!this.boolQueen62) {
                                            this.biciePlanszeQueen.push(this.scene.children[this.id - ((i + 1) * 9)])
                                            for (let j = 64; j < this.scene.children.length; j++) {
                                                if (this.scene.children[this.id - (i * 9)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id - (i * 9)].position.x && this.scene.children[j].position.z == this.scene.children[this.id - (i * 9)].position.z) {
                                                    this.bicieQueen.push(this.scene.children[j])
                                                    break
                                                }
                                            }
                                            this.boolQueen22 = true
                                        }
                                    }
                                }
                            }
                            if (this.scene.children[this.id - (i * 7)] != undefined && this.scene.children[this.id - (i * 7)].name != "pionek-black" && this.scene.children[this.id - (i * 7)].name != "pionek-white" && this.scene.children[this.id - (i * 7)].name != "plansza-white") {
                                this.sameColor
                                for (let j = 64; j < this.scene.children.length; j++) {
                                    if (this.scene.children[this.id - (i * 7)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id - (i * 7)].position.x && this.scene.children[j].position.z == this.scene.children[this.id - (i * 7)].position.z) {
                                        this.boolQueen3 = true
                                        this.sameColor = this.scene.children[j]
                                        break
                                    }
                                }
                                if (!this.boolQueen3)
                                    this.planszaQueen.push(this.scene.children[this.id - (i * 7)])
                                else if (!this.boolQueen33 && this.scene.children[this.id - ((i + 1) * 7)] != undefined && this.scene.children[this.id - ((i + 1) * 7)].name != "pionek-white" && this.scene.children[this.id - ((i + 1) * 7)].name != "pionek-black" && this.scene.children[this.id - ((i + 1) * 7)].name != "plansza-white") {
                                    if (this.color == "black") {
                                        if (this.sameColor.name == "pionek-black")
                                            this.boolQueen53 = true
                                    } else {
                                        if (this.sameColor.name == "pionek-white")
                                            this.boolQueen53 = true
                                    }
                                    if (!this.boolQueen53) {
                                        for (let j = 64; j < this.scene.children.length; j++) {
                                            if (this.scene.children[this.id - ((i - 1) * 7)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id - ((i + 1) * 7)].position.x && this.scene.children[j].position.z == this.scene.children[this.id - ((i + 1) * 7)].position.z) {
                                                this.boolQueen63 = true
                                                break
                                            }
                                        }
                                        if (!this.boolQueen63) {
                                            this.biciePlanszeQueen.push(this.scene.children[this.id - ((i + 1) * 7)])
                                            for (let j = 64; j < this.scene.children.length; j++) {
                                                if (this.scene.children[this.id - (i * 7)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id - (i * 7)].position.x && this.scene.children[j].position.z == this.scene.children[this.id - (i * 7)].position.z) {
                                                    this.bicieQueen.push(this.scene.children[j])
                                                    break
                                                }
                                            }
                                            this.boolQueen33 = true
                                        }
                                    }
                                }
                            }
                            if (this.scene.children[this.id + (i * 9)] != undefined && this.scene.children[this.id + (i * 9)].name != "pionek-black" && this.scene.children[this.id + (i * 9)].name != "pionek-white" && this.scene.children[this.id + (i * 9)].name != "plansza-white") {
                                this.sameColor
                                for (let j = 64; j < this.scene.children.length; j++) {
                                    if (this.scene.children[this.id + (i * 9)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id + (i * 9)].position.x && this.scene.children[j].position.z == this.scene.children[this.id + (i * 9)].position.z) {
                                        this.boolQueen4 = true
                                        this.sameColor = this.scene.children[j]
                                        break
                                    }
                                }
                                if (!this.boolQueen4)
                                    this.planszaQueen.push(this.scene.children[this.id + (i * 9)])
                                else if (!this.boolQueen44 && this.scene.children[this.id + ((i + 1) * 9)] != undefined && this.scene.children[this.id + ((i + 1) * 9)].name != "pionek-white" && this.scene.children[this.id + ((i + 1) * 9)].name != "pionek-black" && this.scene.children[this.id + ((i + 1) * 9)].name != "plansza-white") {
                                    if (this.color == "black") {
                                        if (this.sameColor.name == "pionek-black")
                                            this.boolQueen54 = true
                                    } else {
                                        if (this.sameColor.name == "pionek-white")
                                            this.boolQueen54 = true
                                    }
                                    if (!this.boolQueen54) {
                                        for (let j = 64; j < this.scene.children.length; j++) {
                                            if (this.scene.children[this.id + ((i - 1) * 9)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id + ((i + 1) * 9)].position.x && this.scene.children[j].position.z == this.scene.children[this.id + ((i + 1) * 9)].position.z) {
                                                this.boolQueen64 = true
                                                break
                                            }
                                        }
                                        if (!this.boolQueen64) {
                                            this.biciePlanszeQueen.push(this.scene.children[this.id + ((i + 1) * 9)])
                                            for (let j = 64; j < this.scene.children.length; j++) {
                                                if (this.scene.children[this.id + (i * 9)] != undefined && this.scene.children[j].position.x == this.scene.children[this.id + (i * 9)].position.x && this.scene.children[j].position.z == this.scene.children[this.id + (i * 9)].position.z) {
                                                    this.bicieQueen.push(this.scene.children[j])
                                                    break
                                                }
                                            }
                                            this.boolQueen44 = true
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (this.queensTab.includes(this.activePionek)) {
                        this.planszaQueen.forEach(e => {
                            e.material.color.setHex(0x92DFF3)
                        })
                        this.biciePlanszeQueen.forEach(e => {
                            e.material.color.setHex(0xff0000)
                        })
                    }

                    //end queen bicie


                    if (this.color == "white") {
                        if (this.scene.children[this.id + 7] != undefined && this.scene.children[this.id + 7].name != "pionek-white" && this.scene.children[this.id + 7].name != "plansza-white")
                            this.plansza1 = this.scene.children[this.id + 7]
                        if (this.scene.children[this.id - 9] != undefined && this.scene.children[this.id - 9].name != "pionek-white" && this.scene.children[this.id - 9].name != "plansza-white")
                            this.plansza2 = this.scene.children[this.id - 9]
                    } else {
                        if (this.scene.children[this.id - 7] != undefined && this.scene.children[this.id - 7].name != "pionek-black" && this.scene.children[this.id - 7].name != "plansza-white")
                            this.plansza1 = this.scene.children[this.id - 7]
                        if (this.scene.children[this.id + 9] != undefined && this.scene.children[this.id + 9].name != "pionek-black" && this.scene.children[this.id + 9].name != "plansza-white")
                            this.plansza2 = this.scene.children[this.id + 9]
                    }

                    this.ok2 = false
                    if (this.plansza1 != undefined) {
                        for (let i = 64; i < this.scene.children.length; i++) {
                            if (this.scene.children[i].position.x == this.plansza1.position.x && this.scene.children[i].position.z == this.plansza1.position.z) {
                                this.ok2 = true
                            }
                        }
                    }
                    this.ok3 = false
                    if (this.plansza2 != undefined) {
                        for (let i = 64; i < this.scene.children.length; i++) {
                            if (this.scene.children[i].position.x == this.plansza2.position.x && this.scene.children[i].position.z == this.plansza2.position.z) {
                                this.ok3 = true
                            }
                        }
                    }

                    this.ok4 = false
                    if (this.plansza1 != undefined) {
                        for (let i = 64; i < this.scene.children.length; i++) {
                            if (this.scene.children[i].position.x == this.plansza1.position.x && this.scene.children[i].position.z == this.plansza1.position.z) {
                                if (this.color == "black") {
                                    if (this.scene.children[i].name == "pionek-black")
                                        this.ok4 = true
                                } else {
                                    if (this.scene.children[i].name == "pionek-white")
                                        this.ok4 = true
                                }
                            }
                        }
                    }
                    this.ok5 = false
                    if (this.plansza2 != undefined) {
                        for (let i = 64; i < this.scene.children.length; i++) {
                            if (this.scene.children[i].position.x == this.plansza2.position.x && this.scene.children[i].position.z == this.plansza2.position.z) {
                                if (this.color == "black") {
                                    if (this.scene.children[i].name == "pionek-black")
                                        this.ok5 = true
                                } else {
                                    if (this.scene.children[i].name == "pionek-white")
                                        this.ok5 = true
                                }
                            }
                        }
                    }

                    this.ok6 = false
                    if (!this.ok2 && this.plansza1 != undefined && this.plansza1.name != "pionek-white" && this.plansza1.name != "pionek-black")
                        this.plansza1.material.color.setHex(0x92DFF3)
                    else if (!this.ok4 && this.plansza1 != undefined && this.plansza1.name != "pionek-white" && this.plansza1.name != "pionek-black") {
                        if ((this.scene.children[this.id + 14] != undefined && this.scene.children[this.id + 14].name != "pionek-white" && this.scene.children[this.id + 14].name != "pionek-black") || (this.scene.children[this.id - 14] != undefined && this.scene.children[this.id - 14].name != "pionek-white" && this.scene.children[this.id - 14].name != "pionek-black")) {
                            if (this.color == "white" && this.scene.children[this.id + 14] != undefined) {
                                for (let i = 64; i < this.scene.children.length; i++) {
                                    if (this.scene.children[this.id + 14] != undefined && this.scene.children[i].position.x == this.scene.children[this.id + 14].position.x && this.scene.children[i].position.z == this.scene.children[this.id + 14].position.z) {
                                        this.ok6 = true
                                    }
                                }
                                if (!this.ok6) {
                                    if (this.scene.children[this.id + 14].name != "plansza-white") {
                                        this.plansza1 = this.scene.children[this.id + 14]
                                        this.plansza1.material.color.setHex(0xff0000)
                                        for (let i = 64; i < this.scene.children.length; i++) {
                                            if (this.scene.children[i].position.x == this.scene.children[this.id + 7].position.x && this.scene.children[i].position.z == this.scene.children[this.id + 7].position.z) {
                                                this.bicie1 = this.scene.children[i]
                                            }
                                        }
                                    }
                                }
                            } else if (this.color == "black" && this.scene.children[this.id - 14] != undefined) {
                                for (let i = 64; i < this.scene.children.length; i++) {
                                    if (this.scene.children[this.id - 14] != undefined && this.scene.children[i].position.x == this.scene.children[this.id - 14].position.x && this.scene.children[i].position.z == this.scene.children[this.id - 14].position.z) {
                                        this.ok6 = true
                                    }
                                }
                                if (!this.ok6) {
                                    if (this.scene.children[this.id - 14].name != "plansza-white") {
                                        this.plansza1 = this.scene.children[this.id - 14]
                                        this.plansza1.material.color.setHex(0xff0000)
                                        for (let i = 64; i < this.scene.children.length; i++) {
                                            if (this.scene.children[i].position.x == this.scene.children[this.id - 7].position.x && this.scene.children[i].position.z == this.scene.children[this.id - 7].position.z) {
                                                this.bicie1 = this.scene.children[i]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    this.ok6 = false
                    if (!this.ok3 && this.plansza2 != undefined && this.plansza2.name != "pionek-white" && this.plansza2.name != "pionek-black")
                        this.plansza2.material.color.setHex(0x92DFF3)
                    else if (!this.ok5 && this.plansza2 != undefined && this.plansza2.name != "pionek-white" && this.plansza2.name != "pionek-black") {
                        if ((this.scene.children[this.id - 18] != undefined && this.scene.children[this.id - 18].name != "pionek-white" && this.scene.children[this.id - 18].name != "pionek-black") || (this.scene.children[this.id + 18] != undefined && this.scene.children[this.id + 18].name != "pionek-white" && this.scene.children[this.id + 18].name != "pionek-black")) {
                            if (this.color == "white" && this.scene.children[this.id - 18] != undefined) {
                                for (let i = 64; i < this.scene.children.length; i++) {
                                    if (this.scene.children[this.id - 18] != undefined && this.scene.children[i].position.x == this.scene.children[this.id - 18].position.x && this.scene.children[i].position.z == this.scene.children[this.id - 18].position.z) {
                                        this.ok6 = true
                                    }
                                }
                                if (!this.ok6) {
                                    if (this.scene.children[this.id - 18].name != "plansza-white") {
                                        this.plansza2 = this.scene.children[this.id - 18]
                                        this.plansza2.material.color.setHex(0xff0000)
                                        for (let i = 64; i < this.scene.children.length; i++) {
                                            if (this.scene.children[i].position.x == this.scene.children[this.id - 9].position.x && this.scene.children[i].position.z == this.scene.children[this.id - 9].position.z) {
                                                this.bicie2 = this.scene.children[i]
                                            }
                                        }
                                    }
                                }
                            } else if (this.color == "black" && this.scene.children[this.id + 18] != undefined) {
                                for (let i = 64; i < this.scene.children.length; i++) {
                                    if (this.scene.children[this.id + 18] != undefined && this.scene.children[i].position.x == this.scene.children[this.id + 18].position.x && this.scene.children[i].position.z == this.scene.children[this.id + 18].position.z) {
                                        this.ok6 = true
                                    }
                                }
                                if (!this.ok6) {
                                    if (this.scene.children[this.id + 18].name != "plansza-white") {
                                        this.plansza2 = this.scene.children[this.id + 18]
                                        this.plansza2.material.color.setHex(0xff0000)
                                        for (let i = 64; i < this.scene.children.length; i++) {
                                            if (this.scene.children[i].position.x == this.scene.children[this.id + 9].position.x && this.scene.children[i].position.z == this.scene.children[this.id + 9].position.z) {
                                                this.bicie2 = this.scene.children[i]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (this.opponent) {
            this.opponent = false
            this.x = this.opponentObject.oldPosition.x
            this.y = this.opponentObject.oldPosition.y
            this.z = this.opponentObject.oldPosition.z
            this.pionek
            for (let i = 64; i < this.scene.children.length; i++) {
                if (this.scene.children[i].position.x == this.x && this.scene.children[i].position.y == this.y && this.scene.children[i].position.z == this.z) {
                    this.pionek = this.scene.children[i]
                    break
                }
            }
            if (this.opponentBicie) {
                for (let i = 64; i < this.scene.children.length; i++) {
                    if (this.scene.children[i].position.x == this.opponentObject.bityPionek.x && this.scene.children[i].position.z == this.opponentObject.bityPionek.z) {
                        this.opponetBicieObject = this.scene.children[i]
                        break
                    }
                }
                this.scene.remove(this.opponetBicieObject)
                this.opponentBicie = false
            }

            const tween = new TWEEN.Tween(this.pionek.position)
                .to({ x: this.opponentObject.newPosition.x, y: this.opponentObject.newPosition.y, z: this.opponentObject.newPosition.z }, 300)

            tween.start()
        }

        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
    }

    whoseTurn = (color) => {
        if (color != this.color)
            this.yourTurn = true
        else
            this.yourTurn = false
    }

    setQueensTab = (newQueens) => {
        this.queensTab2 = []
        newQueens.forEach(e => {
            for (let i = 0; i < this.scene.children.length; i++) {
                if (e == this.scene.children[i].id)
                    this.queensTab2.push(this.scene.children[i])
            }
        })
        this.queensTab = this.queensTab2
        this.queensTab.forEach(e => {
            e.material.opacity = 0.5
        })
    }

    opponentMove = (obj) => {
        if (obj.color != this.color) {
            this.opponent = true
            this.opponentObject = obj
            this.bool = false
            if (obj.bityPionek != undefined && this.counter < 1)
                this.opponentBicie = true
            this.counter++
        } else {
            this.counter = 0
        }
    }

    //raycaster
    pionekKlik = (e) => {
        this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        this.bool = true
        this.klikBool = true
    }

    //tworzenie obiektów
    addSzachownica = () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.geometry = new THREE.BoxGeometry(10, 1, 10);
                if (this.szachownica[i][j] == 1) {
                    this.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load('../textures/wood_white.jpg'),
                        transparent: true,
                        opacity: 1,
                    })
                    this.cube = new Item(this.geometry, this.material);
                    this.cube.position.set((i - 4) * 10 + 5, 0, (j - 4) * 10 + 5)
                    this.cube.name = `plansza-white`
                    this.scene.add(this.cube)
                }
                else {
                    this.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load('../textures/wood_white.jpg'),
                        transparent: true,
                        opacity: 1,
                    })
                    this.cube = new Item(this.geometry, this.material);
                    this.cube.material.color.setHex(0x654321)
                    this.cube.position.set((i - 4) * 10 + 5, 0, (j - 4) * 10 + 5)
                    this.cube.name = `plansza-black`
                    this.scene.add(this.cube)
                }
            }
        }
    }

    addPionki = () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.x = (j - 4) * 10 + 5
                this.y = 1
                this.z = (i - 4) * 10 + 5
                if (this.pionki[i][j] == 1) {
                    this.geometry = new THREE.CylinderGeometry(4, 4, 3, 32);
                    this.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load('../textures/white_wood2.jpg'),
                        transparent: true,
                        opacity: 1,
                    })
                    this.pionek = new Pionek(this.geometry, this.material)
                    this.pionek.position.set(this.x, this.y, this.z)
                    this.pionek.name = "pionek-white"
                    this.scene.add(this.pionek)
                }
                else if (this.pionki[i][j] == 2) {
                    this.geometry = new THREE.CylinderGeometry(4, 4, 3, 32);
                    this.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load('../textures/white_wood2.jpg'),
                        transparent: true,
                        opacity: 1,
                    })
                    this.material.color.setHex(0x000000)
                    this.pionek = new Pionek(this.geometry, this.material)
                    this.pionek.position.set(this.x, this.y, this.z)
                    this.pionek.name = "pionek-black"
                    this.scene.add(this.pionek)
                }
            }
        }
    }

    changeCamera = () => {
        this.camera.position.set(0, 70, -100)
        this.camera.lookAt(this.scene.position)
    }

    resize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setColor = (color) => {
        this.color = color
        this.yourTurn = true
    }

    getObjects = (game, ui, net) => {
        this.game = game
        this.ui = ui
        this.net = net
    }
}

export default Game