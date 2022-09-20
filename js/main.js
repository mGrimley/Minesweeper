/*----- constants -----*/ 


/*----- app's state (variables) -----*/ 


/*----- cached element references -----*/ 
const minefieldEl = document.querySelector('.minefield')
const quickResetBtnEl = document.querySelector('.quick-reset')
const customResetBtnEl = document.querySelector('.custom-reset')
const rulesBtnEl = document.querySelector('.rules')

/*----- event listeners -----*/ 
minefieldEl.addEventListener('click', handleBoardClick)
quickResetBtnEl.addEventListener('click', handleResetClick)
customResetBtnEl.addEventListener('click', handleCustomResetClick)
rulesBtnEl.addEventListener('click', handleRulesClick)


/*----- functions -----*/




/* THIS IS WRONG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
function handleBoardClick(evt) {
    if(!(evt.target.classList.contains('minefield'))) {
        const xCoord = (evt.target.classList[1])[1]
        const yCoord = (evt.target.classList[2])[1]
        console.log(`${xCoord}, ${yCoord}`)

        if(quickResetBtnEl.disabled) {
            quickResetBtnEl.disabled = false
        }


        evt.target.style.background = 'red';
    }
}

function handleResetClick(evt) {
    renderMinefield(minefield.rowNum, minefield.colNum)
    console.log(evt.target)
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

    // Destroy all previous cells, if any
    while(minefieldEl.firstChild) {
        minefieldEl.removeChild(minefieldEl.lastChild)
    }
    
    // Create all 
    for(let i = minefield.rowNum; i >= 1; i--) {
        
        for(let j = 1; j <= minefield.colNum; j++) {
            const newCell = document.createElement('div');

            newCell.classList.add('cell', `r${j}`, `c${i}`)
            
            document.querySelector('.minefield').appendChild(newCell)
        }      
    }


}

const minefield = {    
    rowNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--rowNum')), 
    colNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--colNum')),
    numMines: 10,
}

renderMinefield(minefield.rowNum, minefield.colNum)



// const card = {
//     suit: 'c',
//     value: 'A'
    
// }

// document.querySelector('div').classList.add(card.suit + card.value)