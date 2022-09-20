/*----- constants -----*/ 
const MAX_WIDTH = 40
const MAX_HEIGHT = 40
const MAX_MINES = 99
const STATE = {
    hidden: 'gray', 
    flagged: 'yellow',
    mine: 'red',
    number: 'none',
}
const DIFFICULTIES = ['easy', 'medium', 'hard', 'custom']

/*----- app's state (variables) -----*/ 
let numMines = currentMines = 10

console.log(currentMines)

/*----- cached element references -----*/ 
const minefieldEl = document.querySelector('.minefield')
const mineCountEl = document.querySelector('.mine-count')
const quickResetBtnEl = document.querySelector('.quick-reset')
const customResetBtnEl = document.querySelector('.custom-reset')
const rulesBtnEl = document.querySelector('.rules')

/*----- event listeners -----*/ 
// Minefield
minefieldEl.addEventListener('click', handleBoardLeftClick)
minefieldEl.addEventListener('contextmenu', handleBoardRightClick)

// Footer buttons
quickResetBtnEl.addEventListener('click', handleResetClick)
customResetBtnEl.addEventListener('click', handleCustomResetClick)
rulesBtnEl.addEventListener('click', handleRulesClick)


/*----- functions -----*/




/* THIS IS WRONG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (KIND OF) */
function handleBoardLeftClick(evt) {
    quickResetBtnEl.disabled = false

    const targetCell = evt.target


    if(targetCell.classList.contains('cell')) {
    const tmpCellState = targetCell.classList[1]

        if(tmpCellState === 'flagged') {

        } else if(tmpCellState === 'hidden') {
            targetCell.classList.replace(tmpCellState, 'uncovered')
        }
    }
}

function handleBoardRightClick(evt) {
    evt.preventDefault()
    quickResetBtnEl.disabled = false

    const targetCell = evt.target

    if(targetCell.classList.contains('cell')) {
        const tmpCellState = targetCell.classList[1]

        if(tmpCellState === 'hidden') {
            targetCell.classList.replace(tmpCellState, 'flagged')
            --currentMines
            //currentMines-- ?
        } else if(tmpCellState === 'flagged') {
            targetCell.classList.replace(tmpCellState, 'hidden')
            ++currentMines
        }

        
        if(currentMines === 0) {
            mineCountEl.style.color = 'green'
            //set number green
        } else if(currentMines < 0) {
            mineCountEl.style.color = 'red'
            // set number red
        } else {
            mineCountEl.style.color = 'black'
            // set number black
        }

        mineCountEl.textContent = currentMines
        
    }

    // setColor(evt, STATE.flagged)
}

function handleResetClick(evt) {
    renderMinefield(minefield.rowNum, minefield.colNum)
}

function handleCustomResetClick(evt) {
    console.log(evt.target)
}

function handleRulesClick(evt) {
    console.log(evt.target)
}

function renderMinefield() {
    // Reset quick reset button
    quickResetBtnEl.disabled = true

    // Reset mineCountEl color
    mineCountEl.style.color = 'black'

    // Set mines equal to starting amount
    mineCountEl.innerHTML = numMines
    currentMines = numMines

    // Destroy all previous cells, if any
    while(minefieldEl.firstChild) {
        minefieldEl.removeChild(minefieldEl.lastChild)
    }
    
    // Create specified number of cells 
    for(let i = minefield.rowNum; i >= 1; i--) {
        
        for(let j = 1; j <= minefield.colNum; j++) {
            const newCell = document.createElement('div');

            newCell.classList.add('cell', 'hidden', `r${j}`, `c${i}`)
            
            document.querySelector('.minefield').appendChild(newCell)
        }      
    }


}

const minefield = {    
    rowNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--rowNum')), 
    colNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--colNum')),
    numMines: numMines,
    difficulty: getDifficulty(),
}

function getDifficulty() {

}

class Cell {
    constructor(xCoord, yCoord, state) {
        this.xCoord = xCoord
        this.yCoord = yCoord
        this.state = state
    }
}

renderMinefield(minefield.rowNum, minefield.colNum)



// const card = {
//     suit: 'c',
//     value: 'A'
    
// }

// document.querySelector('div').classList.add(card.suit + card.value)