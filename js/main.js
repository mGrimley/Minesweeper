/*----- constants -----*/ 


/*----- app's state (variables) -----*/ 


/*----- cached element references -----*/ 


/*----- event listeners -----*/ 


/*----- functions -----*/

class Cell {
    constructor(colCoord, rowCoord) {
        this.colCoord = colCoord;
        this.rowCoord = rowCoord;
    }
}

function populateMinefield(colNum, rowNum) {
    

    for(let i = 1; i <= colNum; i++) {
        
        for(let j = 1; j <= rowNum; j++) {
            const newCell = document.createElement('div');

            newCell.classList.add('cell', `r${i}`, `c${j}`)
            
            document.querySelector('.minefield').appendChild(newCell)
        }      
    }


}

const minefieldEl = document.querySelector('.minefield')

const minefield = {    
    rowNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--rowNum')), 
    colNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--colNum'))
}

populateMinefield(minefield.rowNum, minefield.colNum)



// const card = {
//     suit: 'c',
//     value: 'A'
    
// }

// document.querySelector('div').classList.add(card.suit + card.value)