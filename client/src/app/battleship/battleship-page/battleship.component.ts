import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BattleshipService } from '../services/battleship.service';

@Component({
  selector: 'app-battleship',
  templateUrl: './battleship.component.html',
  styleUrls: ['./battleship.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BattleshipComponent implements OnInit {

  newGameButton: any;
  singleplayerButton: any;
  initialScreen: any;
  gameScreen: any;
  gameCodeInput: any;
  gameCodeDisplay: any;
  joinGameButton: any;
  playerNumber: any;
  gameCode: string;
  onlineCount: number;
  rematchButton: any;
  battleHomeButton: any;
  gameWinnerMessage: any;
  gameActive = false;
  rematchButtonDisabled: boolean = true;
  battleshipHomeButtonDisabled: boolean = true; //////
  stateReceived: boolean = false;      /////
  rematchCount: number = 0;    /////
  num: any;
  player1: HTMLElement;
  player2: HTMLElement;

  userGrid: HTMLElement;
  computerGrid: HTMLElement;
  displayGrid: HTMLElement;
  ships: NodeListOf<Element>;
  destroyer: HTMLElement;
  submarine: HTMLElement;
  cruiser: HTMLElement;
  battleship: HTMLElement;
  carrier: HTMLElement;
  startButton: HTMLElement;
  rotateButton: HTMLElement;
  turnDisplay: HTMLElement;
  infoDisplay: HTMLElement;
  setupButtons: HTMLElement;
   selectedShipNameWithIndex: any;
   draggedShip: any;
   draggedShipLength : any;
     userSquares = []
     computerSquares = []
     isHorizontal = true
     isGameOver = false
     currentPlayer = 'user'
  uisegment:HTMLElement;

     playerNum = 0
     ready = false
     enemyReady = false
     allShipsPlaced = false
     shotFired = -1
     userGridReady: boolean = false
     player: any
    occupiedSpace = []
     destroyerCount = 0;
     submarineCount = 0;
     cruiserCount = 0;
     battleshipCount = 0;
     carrierCount = 0;

      cpuDestroyerCount = 0;
      cpuSubmarineCount = 0;
     cpuCruiserCount = 0;
     cpuBattleshipCount = 0;
     cpuCarrierCount = 0;

  Game: string;
  width = 10;
  gameMode = "singlePlayer";
 shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1],
        [0, this.width]
      ]
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2],
        [0, this.width, this.width * 2]
      ]
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2],
        [0, this.width, this.width * 2]
      ]
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3],
        [0, this.width, this.width * 2, this.width * 3]
      ]
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4],
        [0, this.width, this.width * 2, this.width * 3, this.width * 4]
      ]
    },
  ]
  constructor(
    private websocketService: BattleshipService

  ) { }

  ngOnInit(): void {
    this.handleGameCode();
    this.handleInit();
    
    this.handleTooManyPlayers();
    this.handleUnknownGame();
    this.handleOnlineCount();
    this.handleRematchCount();
    this.handleGameOver();
    this.handlReadyUp();
    this.handleShotReceived();
    this.handleGameState();
    this.handleShotResultReceived();
    //this.handleturn();


    //html document values 
    this.gameScreen = document.querySelector('#gameScreen');
    this.initialScreen = document.querySelector('#initialScreen');
    this.newGameButton = document.querySelector('#newGameButton');
    this.singleplayerButton = document.querySelector('#singlePlayerButton');
    this.joinGameButton = document.querySelector('#joinGameButton');
    this.gameCodeInput = document.querySelector('#gameCodeInput');
    this.gameCodeDisplay = document.querySelector('#gameCodeDisplay');
    this.rematchButton = document.querySelector('#rematchButton');
    this.battleHomeButton = document.querySelector('#battleHomeButton');
    this.player1 = document.querySelector('#player1');
    this.player2 = document.querySelector('#player2');
    this.newGameButton.addEventListener('click', this.newGame.bind(this));
    this.singleplayerButton.addEventListener('click', this.singleplayerGame.bind(this));
    this.joinGameButton.addEventListener('click', this.joinGame.bind(this));
    this.uisegment= document.querySelector('.ui-basic-segment')


    this. userGrid = document.querySelector('.grid-user');
    this. computerGrid = document.querySelector('.grid-computer');
    this. displayGrid = document.querySelector('.grid-display');
    this. ships = document.querySelectorAll('.ship');
    this. destroyer = document.querySelector('.destroyer-container');
    this. submarine = document.querySelector('.submarine-container');
    this. cruiser = document.querySelector('.cruiser-container');
    this. battleship = document.querySelector('.battleship-container');
    this. carrier = document.querySelector('.carrier-container');
    this.startButton = document.querySelector('#start');
    this. rotateButton = document.querySelector('#rotate');
    this. turnDisplay = document.querySelector('#whose-go');
    this. infoDisplay = document.querySelector('#info');
    this. setupButtons = document.getElementById('setup-buttons');
    this.rotateButton.addEventListener('click', this.rotate.bind(this));

    this.ships.forEach(ship => ship.addEventListener('dragstart', this.dragStart.bind(this)));
    


console.log(this.ships);

this.ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
 this. selectedShipNameWithIndex = e.target['id'];
  //console.log(selectedShipNameWithIndex);
console.log('mousedown')
  this.userGridReady = true
}))
    // const singlePlayerButton = document.querySelector('#singlePlayerButton')
    //const multiPlayerButton = document.querySelector('#multiPlayerButton')
    
    //Ships


    this.createBoard(this.userGrid, this.userSquares)
    this.createBoard(this.computerGrid,this. computerSquares)
    this.userSquares.forEach(square => square.addEventListener('dragstart', this.dragStart.bind(this)));
    this.userSquares.forEach(square => square.addEventListener('dragover', this.dragOver.bind(this)));
    this.userSquares.forEach(square => square.addEventListener('dragenter', this.dragEnter.bind(this)));
    this.userSquares.forEach(square => square.addEventListener('dragleave', this.dragLeave.bind(this)));
    this.userSquares.forEach(square => square.addEventListener('drop', this.dragDrop.bind(this)));
    this.userSquares.forEach(square => square.addEventListener('dragend', this.dragEnd.bind(this)));
    // Select Player Mode
    if (this.gameMode === 'singlePlayer') {
      this.startSinglePlayer()
    } else {
      //startMultiPlayer()
    }
    // Single Player
    
  }
  handlReadyUp() {
    this.websocketService.battleshipReadyUpEventAll().subscribe(data => {
   let playerdata = data;
   console.log(data);
   console.log(this.playerNumber);
   
      if(this.playerNumber !=playerdata){
       
        let player = `.p${playerdata}`
        document.querySelector(`${player} .connected`).classList.toggle('active')
        document.querySelector(`${player} .ready`).classList.toggle('active')
        this.enemyReady= true;

        this.playGameMulti();
      }
      
  
  
    });
  }

  newGame() {//ok
    this.websocketService.battleshipNewGame();
    this.gameMode ="multiPlayer";
    this.playerNumber = 1;
   
    let player = `.p${parseInt(this.playerNumber)}`
    document.querySelector(`${player} .connected`).classList.toggle('active')
    this.init();
    this.player1.style.display = 'block';
    this.player2.style.display = 'block';
  }

  singleplayerGame() {
    this.websocketService.battleshipNewGame();
    this.init();
  }

  joinGame() {//ok
    const code = this.gameCodeInput.value;
    this.gameCode = this.gameCodeInput.value;
    this.websocketService.battleshipJoinGame(code.toString());
    this.gameMode ="multiPlayer";
    this.playerNumber =2;
    this.turnDisplay.innerHTML = 'enemy go';
    this.currentPlayer = 'enemy'
    this.init();
    this.player1.style.display = 'block';
    this.player2.style.display = 'block';
  }

  rematch() {//ok
    if (this.rematchButtonDisabled === false) {
      this.websocketService.battleshipSendRematchEvent(this.gameCode);
    }
  }

  battleshipsHome() {//ok
    window.location.reload();
  }

  init() {//ok
    this.initialScreen.style.display = 'none';
    this.gameScreen.style.display = 'block';
    this.gameWinnerMessage = "";
    this.gameActive = true;

  }

  handleInit() {//ok
    this.websocketService.battleshipInit().subscribe(data => {
      this.playerNumber = data['playerNumber'];
    });
  }

  handleGameState() {
    this.websocketService.battleshipGamestate().subscribe(data => {

    });
  }

  handleGameOver() {
    this.websocketService.battleshipGameOver().subscribe(data => {
      if (this.playerNumber === parseInt(data['winner'])) {
        this.gameWinnerMessage = "You Win!";
      }
      else {
        this.gameWinnerMessage = "You Lose";
      }

      this.gameActive = false;
      this.rematchButtonDisabled = false;
      this.battleshipHomeButtonDisabled = false;
      this.stateReceived = false;
    })
  }


  handleGameCode() {//ok
    this.websocketService.battleshipGameCode().subscribe(data => {
      console.log(data['gameCode'])
      this.gameCodeDisplay.innerText = data['gameCode'];
      this.gameCode = data['gameCode'];
    })
  }

  handleUnknownGame() {//ok
    this.websocketService.battleshipUnknownGame().subscribe(data => {
      this.reset();
      alert('Unknown game code');
    })
  }

  handleTooManyPlayers() {//ok
    this.websocketService.battleshipTooManyPlayers().subscribe(data => {
      this.reset();
      alert('This game is already in progress');
    })
  }

  handleOnlineCount() {//ok
    this.websocketService.battleshipOnlineCount().subscribe(data => {
      this.onlineCount = parseInt(data['rematchCount']);
    })
  }

  handleRematchCount() {//ok
    this.websocketService.battleshipRematchCount().subscribe(data => {
      this.rematchCount = parseInt(data['rematchCount'])
      if (this.rematchCount === 2) {
        this.rematchCount = 0;
        this.rematchButtonDisabled = true;
        this.battleshipHomeButtonDisabled = true;
      }
    });
  }

  reset() {//ok
    this.playerNumber = null;
    this.gameCodeInput.value = "";
    this.gameCodeDisplay.innerText = "";
    this.initialScreen.style.display = "block";
    this.gameScreen.style.display = "none";
  }
  startSinglePlayer() {

    this.generate(this.shipArray[0])
    this.generate(this.shipArray[1])
    this.generate(this.shipArray[2])
    this.generate(this.shipArray[3])
    this.generate(this.shipArray[4])

    this.startButton.addEventListener('click', () =>
    {
      if(this.allShipsPlaced) 
        {
      
        console.log('clicked startbutton')
        this.playerReady();

          if (this.userGridReady === true&& this.gameMode== 'singlePlayer')
          {this.playGameSingle();
          }
          else{

            this.playerReady();

          }  
      }
      else this.infoDisplay.innerHTML = "Please place all ships"
    }
    )
   
  }
  playGameMulti() {

    this.computerSquares.forEach(square => square.addEventListener('click',this.shootmulti.bind(this))); 
    if(this.currentPlayer =='user')
    {
      this.uisegment.style.pointerEvents = 'all';

    }

  }
  // code for shoot multi is sending shot data to enemy
  shootmulti(event)
  { 

    this.shotFired = event.target.dataset.id
    this.websocketService.battleshipShoot(this.gameCode,this.shotFired,this.playerNumber);
    this.uisegment.style.pointerEvents = 'none';
  }
  //code for receiving the shot from enemy
  handleShotReceived(){
    this.websocketService.battleshipShootReceive().subscribe(data => {
   
      let square = data['x1'];
      let playerenemy = data['x2']
      let ship:string;
      let hit;
    if(playerenemy != this.playerNumber){
      if (!this.userSquares[square].classList.contains('boom')) 
      {
         hit = this.userSquares[square].classList.contains('taken') // true or false here  if contains taken then will result in boom next line
        this.userSquares[square].classList.add(hit ? 'boom' : 'miss')
        if (this.userSquares[square].classList.contains('destroyer')) {this.cpuDestroyerCount++;   ship ='destroyer';
        }
        if (this.userSquares[square].classList.contains('submarine')) {this.cpuSubmarineCount++;   ship ='submarine';
        }
        if (this.userSquares[square].classList.contains('cruiser')) {this.cpuCruiserCount++;   ship ='cruiser';
        }
        if (this.userSquares[square].classList.contains('battleship')) {this.cpuBattleshipCount++;   ship ='battleship';
        }
        if (this.userSquares[square].classList.contains('carrier')) {this.cpuCarrierCount++;   ship ='carrier';
        }
        this.checkForWins();
      } 
      this.websocketService.battleshipSendShotResult(this.gameCode,square,ship,hit,this.playerNumber);
      this.turnDisplay.innerHTML = 'Your Go'
      this.currentPlayer = 'user';
      this.uisegment.style.pointerEvents = 'all';
    }
       });


  }

  handleShotResultReceived(){

    this.websocketService.battleshipShotResultReceive().subscribe(data => {
   
      let square = data['x1'];
   
      let ship=data['x2'];
      let hit = data['x3'];
      let playerenemy = data['x4']
      console.log(playerenemy);
      console.log(this.playerNumber);
      if(playerenemy != this.playerNumber)
      {
          const enemySquare = this.computerGrid.querySelector(`div[data-id='${square}']`)
       
        if (!enemySquare.classList.contains('boom') && this.currentPlayer === 'user' && !this.isGameOver) 
        {
          if (ship== 'destroyer') this.destroyerCount++
          if (ship=='submarine') this.submarineCount++
          if (ship=='cruiser') this.cruiserCount++
          if (ship=='battleship') this.battleshipCount++
          if (ship=='carrier') this.carrierCount++
        }
        if (hit ==true) 
        {
          enemySquare.classList.add('boom')
        } else {
          enemySquare.classList.add('miss')
        }
        this.checkForWins()
        this.currentPlayer = 'enemy';
        this.turnDisplay.innerHTML = 'enemy go';
      }
    });


  }
      //Create Board
      createBoard(grid, squares) {
  for (let i = 0; i < this.width * this.width; i++) {
    const square = document.createElement('div')
    square.dataset.id = i.toString()
    grid.appendChild(square)
    squares.push(square)
    
  }

}

//Draw the computers ships in random locations
generate(ship) {
  let direction
  let randomDirection = Math.floor(Math.random() * ship.directions.length)
  let current = ship.directions[randomDirection]

console.log(ship)
console.log(ship.directions[randomDirection])
  if (randomDirection === 0) direction = 1
  if (randomDirection === 1) direction = 10
  let randomStart = Math.abs(Math.floor(Math.random() * this.computerSquares.length - (ship.directions[0].length * direction)))

  const isTaken = current.some(index => this.computerSquares[randomStart + index].classList.contains('taken'))
  const isAtRightEdge = current.some(index => (randomStart + index) % this.width === this.width - 1)
  const isAtLeftEdge = current.some(index => (randomStart + index) % this.width === 0)

  if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => this.computerSquares[randomStart + index].classList.add('taken', ship.name))

  else this.generate(ship)
}

// rotate the ships
 rotate() {
  if (this.isHorizontal) {
    this.destroyer.classList.toggle('destroyer-container-vertical')
    this.submarine.classList.toggle('submarine-container-vertical')
    this.cruiser.classList.toggle('cruiser-container-vertical')
    this.battleship.classList.toggle('battleship-container-vertical')
    this.carrier.classList.toggle('carrier-container-vertical')
    this.isHorizontal = false
    // console.log(isHorizontal)
    return
  }
  if (!this.isHorizontal) {
    this.destroyer.classList.toggle('destroyer-container-vertical')
    this.submarine.classList.toggle('submarine-container-vertical')
    this.cruiser.classList.toggle('cruiser-container-vertical')
    this.battleship.classList.toggle('battleship-container-vertical')
    this.carrier.classList.toggle('carrier-container-vertical')
    this. isHorizontal = true
    // console.log(isHorizontal)
    return
  }
}



//move around user ship


 dragStart(e) {
  let draggedShip =e.target;
  let draggedShipLength = e.target.childNodes.length;
  this.draggedShip = draggedShip;
  this.draggedShipLength = draggedShipLength;
  console.log(e.target)
  console.log(e.target.childNodes.length)
  console.log(draggedShip);
}

 dragOver(e) {
  e.preventDefault();
  
}

dragEnter(e) {
  
  e.preventDefault();
}

dragLeave(e) {
  
  e.preventDefault();
}

 dragDrop(e) {
   console.log('inside drag drop');
  let shipNameWithLastId = this.draggedShip.lastChild.id;
  console.log(this.draggedShip);
  console.log(this.draggedShip.lastChild.id);
 
  let shipClass = shipNameWithLastId .slice(0, -2)
  

  // console.log(shipClass)
  let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
  let shipLastId = lastShipIndex + parseInt(e.target.dataset.id)
  // console.log(shipLastId)
  const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93]
  const notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60]
  // to keep track of space taken
  let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
  let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

  let selectedShipIndex = parseInt(this.selectedShipNameWithIndex.substr(-1))

  shipLastId = shipLastId - selectedShipIndex
  // console.log(shipLastId)
  for (let i = 0; i < this.draggedShipLength; i++) {
    let directionClass
    if (i === 0) directionClass = 'start'
    if (i === this.draggedShipLength - 1) directionClass = 'end'
    console.log(parseInt(e.target.dataset.id) - selectedShipIndex + i)
    console.log('checking if space is occupied')
    console.log(parseInt(e.target.dataset.id))
    if (!this.occupiedSpace.includes(parseInt(e.target.dataset.id) - selectedShipIndex + i)) {

    }
    else {
      console.log(" we got in and should not continue")
      console.log(parseInt(e.target.dataset.id) - selectedShipIndex + i)
      return
    }

  }
  if (this.isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
    for (let i = 0; i < this.draggedShipLength; i++) {
      let directionClass
      if (i === 0) directionClass = 'start'
      if (i === this.draggedShipLength - 1) directionClass = 'end'
      this.userSquares[parseInt(e.target.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass)
      console.log(parseInt(e.target.dataset.id) - selectedShipIndex + i);
      this.occupiedSpace.push(parseInt(e.target.dataset.id) - selectedShipIndex + i);

    }
    //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
    //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
  } else if (!this.isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
    for (let i = 0; i < this.draggedShipLength; i++) {
      let directionClass
      if (i === 0) directionClass = 'start'
      if (i === this.draggedShipLength - 1) directionClass = 'end'
      this.userSquares[parseInt(e.target.dataset.id) - selectedShipIndex + this.width * i].classList.add('taken', 'vertical', directionClass, shipClass)
      this.occupiedSpace.push(parseInt(e.target.dataset.id) - selectedShipIndex + this.width * i);
    }
  }

  else return

  this.displayGrid.removeChild(this.draggedShip)
  if (!this.displayGrid.querySelector('.ship')) this.allShipsPlaced = true
}

dragEnd() {
}



playerReady() {
  
  let player = `.p${parseInt(this.playerNumber)}`
  document.querySelector(`${player} .ready`).classList.toggle('active')
if (this.gameMode == 'multiPlayer'){
  this.websocketService.battleshipReadyUp(this.gameCode,this.playerNumber);

}
}



// Game Logic for Single Player
 playGameSingle() {
  this.uisegment.style.pointerEvents = 'all';

   console.log('inside playgamesingle function')
   console.log(this.currentPlayer);
  if (this.isGameOver) 
  {console.log('game over at start'); return;
  }
  if (this.currentPlayer === 'user') {
    
    this.turnDisplay.innerHTML = 'Your Go';
    this.computerSquares.forEach(square => square.addEventListener('click',this.shoot.bind(this))); 
  }
  if (this.currentPlayer == 'enemy') {
    this.turnDisplay.innerHTML = 'Computers Go';
    console.log(this.turnDisplay.innerHTML);
   
    this.enemyGo() 
  }
}

 shoot(event){
  this.shotFired = event.target.dataset.id
  this.revealSquare(event.target.classList)
}

revealSquare(classList) {
  const enemySquare = this.computerGrid.querySelector(`div[data-id='${this.shotFired}']`)
  const obj = Object.values(classList)
  if (!enemySquare.classList.contains('boom') && this.currentPlayer === 'user' && !this.isGameOver) {
    if (obj.includes('destroyer')) this.destroyerCount++
    if (obj.includes('submarine')) this.submarineCount++
    if (obj.includes('cruiser')) this.cruiserCount++
    if (obj.includes('battleship')) this.battleshipCount++
    if (obj.includes('carrier')) this.carrierCount++
  }
  if (obj.includes('taken')) {
    enemySquare.classList.add('boom')
  } else {
    enemySquare.classList.add('miss')
  }
  this.checkForWins()
  this.currentPlayer = 'enemy'
  if (this.gameMode === 'singlePlayer') this.playGameSingle()
}



enemyGo() {
  let square;
  console.log(this.gameMode);
  if (this.gameMode == 'singlePlayer') {
    square = Math.floor(Math.random() * this.userSquares.length);
    console.log(this.userSquares[square]);
    console.log(this.userSquares.length);
  }
  if (!this.userSquares[square].classList.contains('boom')) {
    const hit = this.userSquares[square].classList.contains('taken')
    this.userSquares[square].classList.add(hit ? 'boom' : 'miss')
    if (this.userSquares[square].classList.contains('destroyer')) this.cpuDestroyerCount++
    if (this.userSquares[square].classList.contains('submarine')) this.cpuSubmarineCount++
    if (this.userSquares[square].classList.contains('cruiser')) this.cpuCruiserCount++
    if (this.userSquares[square].classList.contains('battleship')) this.cpuBattleshipCount++
    if (this.userSquares[square].classList.contains('carrier')) this.cpuCarrierCount++
    this.checkForWins()
  } else if (this.gameMode === '') this.enemyGo()
  this.currentPlayer = 'user'
  this.turnDisplay.innerHTML = 'Your Go'
}

checkForWins() {
  let enemy = 'computer'
  if (this.gameMode === 'multiPlayer') enemy = 'enemy'
  if (this.destroyerCount === 2) {
    this.infoDisplay.innerHTML = `You sunk the ${enemy}'s destroyer`
    this.destroyerCount = 10
  }
  if (this.submarineCount === 3) {
    this.infoDisplay.innerHTML = `You sunk the ${enemy}'s submarine`
    this.submarineCount = 10
  }
  if (this.cruiserCount === 3) {
    this.infoDisplay.innerHTML = `You sunk the ${enemy}'s cruiser`
    this.cruiserCount = 10
  }
  if (this.battleshipCount === 4) {
    this.infoDisplay.innerHTML = `You sunk the ${enemy}'s battleship`
    this.battleshipCount = 10
  }
  if (this.carrierCount === 5) {
    this.infoDisplay.innerHTML = `You sunk the ${enemy}'s carrier`
    this.carrierCount = 10
  }
  if (this.cpuDestroyerCount === 2) {
    this.infoDisplay.innerHTML = `${enemy} sunk your destroyer`
    this.cpuDestroyerCount = 10
  }
  if (this.cpuSubmarineCount === 3) {
    this.infoDisplay.innerHTML = `${enemy} sunk your submarine`
    this.cpuSubmarineCount = 10
  }
  if (this.cpuCruiserCount === 3) {
    this.infoDisplay.innerHTML = `${enemy} sunk your cruiser`
    this.cpuCruiserCount = 10
  }
  if (this.cpuBattleshipCount === 4) {
    this.infoDisplay.innerHTML = `${enemy} sunk your battleship`
    this.cpuBattleshipCount = 10
  }
  if (this.cpuCarrierCount === 5) {
    this.infoDisplay.innerHTML = `${enemy} sunk your carrier`
    this.cpuCarrierCount = 10
  }

  if ((this.destroyerCount + this.submarineCount + this.cruiserCount + this.battleshipCount + this.carrierCount) === 50) {
    this.infoDisplay.innerHTML = "YOU WIN"
    this.gameOver()
  }
  if ((this.cpuDestroyerCount + this.cpuSubmarineCount + this.cpuCruiserCount + this.cpuBattleshipCount + this.cpuCarrierCount) === 50) {
    this.infoDisplay.innerHTML = `${enemy.toUpperCase()} WINS`
    this.gameOver()
  }
}

 gameOver() {
  this.isGameOver = true
  this.startButton.removeEventListener('click', this.playGameSingle)
}





sendMessage() {

}

  

  
}
