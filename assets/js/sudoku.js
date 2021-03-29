let grid = document.getElementById("grid");
let board = [];

//TODO: Make readOnly fields a different a text color

{ //Board generation
    //Create Groups
    for (let i = 1; i < 10; i++) {
        let groupObj = {
            cells: []
        };

        let group = document.createElement("div");
        group.classList.add("Group");
        group.style.gridArea = "Group" + i;

        //Create Cells
        for (let j = 1; j < 10; j++) {
            let cellObj = {
                value: null,
                readOnly: false,
                pencilEnabled: false,
                pencilValues: [0, 0, 0, 0, 0, 0, 0, 0, 0]
            };

            let cell = document.createElement("div");
            cell.classList.add("Cell");
            cell.style.gridArea = "Cell" + j;

            cell.addEventListener("mousedown", () => {
                setSelectedCell(cell);
            });

            let cellValue = document.createElement("div");
            cellValue.classList.add("CellValue");
            cellValue.style.gridArea = "1 / 1 / 4 / 4";
            //cellValue.style.gridArea = "Pen5";
            //cellValue.classList.add("hidden-pen");
            if (Math.random() >= 0.7) {
                cellObj.value = j;
                cellObj.readOnly = true;
                cellValue.textContent = j;
            }

            cell.append(cellValue);

            //Create Pencil Cells
            for (let k = 1; k < 10; k++) {
                let pen = document.createElement("div");
                pen.classList.add("Pen");
                pen.classList.add("hidden-pen");
                pen.style.gridArea = "Pen" + k;
                pen.textContent = k;

                cell.append(pen);
            }

            groupObj.cells.push(cellObj);
            group.append(cell);
        }

        board.push(groupObj);
        grid.append(group);
    }

    //Options
    let options = document.createElement("div");
    options.classList.add("Options");
    grid.append(options);

    //Number Selection
    let controlNumbers = document.createElement("div");
    controlNumbers.classList.add("ControlNumbers");

    for (let i = 1; i < 10; i++) {
        let numbers = document.createElement("div");
        numbers.classList.add("Numbers");
        numbers.style.gridArea = "N" + i;
        numbers.textContent = i;

        numbers.addEventListener("mousedown", () => {
            setSelectedCellValue(i);
        });

        controlNumbers.append(numbers);
    }

    options.append(controlNumbers);

    //Mode Selection
    let controlOptions = document.createElement("div");
    controlOptions.classList.add("ControlOptions");

    let pencil = document.createElement("div");
    pencil.classList.add("Numbers");
    pencil.style.paddingTop = "40px";
    pencil.textContent = "Pencil";
    pencil.style.gridArea = "Pencil";
    pencil.addEventListener("mousedown", () => {
        isPencilEnabled = !isPencilEnabled;

        if (isPencilEnabled)
            pencil.classList.add("CellActive");
        else
            pencil.classList.remove("CellActive");
    });

    controlOptions.append(pencil);

    let eraser = document.createElement("div");
    eraser.classList.add("Numbers");
    eraser.style.paddingTop = "40px";
    eraser.textContent = "Erase";
    eraser.style.gridArea = "Eraser";
    eraser.addEventListener("mousedown", () => {
        setSelectedCellValue(null);
    });

    controlOptions.append(eraser);

    options.append(controlOptions);
}

let selectedCell = null;
let groupIndex = -1;
let cellIndex = -1;
let isPencilEnabled = false;

function setSelectedCell(element) {
    if (!element) return;

    selectedCell = element;
    getSelectedCellInfo();
    highlightSelectedCell();
}

function getSelectedCellInfo() {
    for (let i = 0; i < 9; i++) {
        if (selectedCell.parentElement == grid.children[i]) {
            groupIndex = i;

            for (let j = 0; j < 9; j++) {
                if (selectedCell == grid.children[i].children[j])
                    cellIndex = j;
            }
        }
    }
}

function highlightSelectedCell() {
    //No need to do additional checks here due to call order

    //Clear board beforehand
    for (let i = 0; i < 9; i++) {
        //Groups
        grid.children[i].classList.remove("CellSubActive");

        //Cells
        for (let j = 0; j < 9; j++) {
            grid.children[i].children[j].classList.remove("CellActive");
            grid.children[i].children[j].classList.remove("CellSubActive");
        }
    }

    //Group
    selectedCell.parentElement.classList.add("CellSubActive");

    //Row
    //let row = Math.trunc(groupIndex / 3) * 3 + Math.trunc(cellIndex / 3);
    let groupRow = Math.trunc(groupIndex / 3) * 3;
    let cellRow = Math.trunc(cellIndex / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++)
            grid.children[groupRow + i].children[cellRow + j].classList.add("CellSubActive");
    }

    //Column
    //let column = (groupIndex % 3) * 3 + cellIndex % 3;
    let groupColumn = groupIndex % 3;
    let cellColumn = cellIndex % 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++)
            grid.children[groupColumn + (i * 3)].children[cellColumn + (j * 3)].classList.add("CellSubActive");
    }

    selectedCell.classList.add("CellActive");

    let selCellData = board[groupIndex].cells[cellIndex];
    if (selCellData.value == null) return;

    //Find numbers in other groups that match the selected cell
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            //Ignore selected cell
            if (i == groupIndex && j == cellIndex) continue;

            let tempCellData = board[i].cells[j];
            if (tempCellData.value != null && tempCellData.value == selCellData.value) {
                grid.children[i].children[j].classList.add("CellActive");
            }
        }
    }
}

function setSelectedCellValue(value) {
    let selCellData = board[groupIndex].cells[cellIndex];
    if (selectedCell == null || selCellData.readOnly) return;

    //Eraser will set the value to null
    if (!isPencilEnabled || value == null) {
        selCellData.value = value;

        if (selCellData.pencilEnabled) {
            selCellData.pencilValues = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            selCellData.pencilEnabled = false;
        }
    } else {
        selCellData.value = null;
        selCellData.pencilEnabled = true;
        selCellData.pencilValues[value - 1] = Number(!selCellData.pencilValues[value - 1]);
    }

    highlightSelectedCell();
    renderCellValues();
}

function renderCellValues() {
    //Updates the values of all the cells to match what's in the board array

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tempCell = grid.children[i].children[j];
            let tempCellData = board[i].cells[j];

            //Remove previous data in the cell
            tempCell.children[0].textContent = null;
            for (let k = 1; k < 10; k++)
                tempCell.children[k].classList.add("hidden-pen");

            if (!tempCellData.pencilEnabled) {
                if (!tempCellData.readOnly)
                    tempCell.children[0].textContent = tempCellData.value;
            } else {
                for (let k = 0; k < 9; k++) {
                    if (tempCellData.pencilValues[k])
                        tempCell.children[k + 1].classList.remove("hidden-pen");
                }
            }
        }
    }
}

//Unused?
function renderCellValue() {
    //Updates the value of the selectedCell in the html element

    let selCellData = board[groupIndex].cells[cellIndex];
    //Remove previous data in the selected cell
    selectedCell.children[0].textContent = null;
    for (let i = 1; i < 10; i++)
        selectedCell.children[i].classList.add("hidden-pen");

    if (!isPencilEnabled) {
        if (!selCellData.readOnly)
            selectedCell.children[0].textContent = selCellData.value;
    } else {
        for (let i = 0; i < 9; i++) {
            if (selCellData.pencilValues[i])
                selectedCell.children[i + 1].classList.remove("hidden-pen");
        }
    }
}
