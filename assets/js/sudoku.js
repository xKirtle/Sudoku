let grid = document.getElementById("grid");

{ //Board generation
    //Create Groups
    for (let i = 1; i < 10; i++) {
        let group = document.createElement("div");
        group.classList.add("Group");
        group.style.gridArea = "Group" + i;

        //Create Cells
        for (let j = 1; j < 10; j++) {
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
            if (Math.random() >= 0.7)
                cellValue.textContent = j;

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

            group.append(cell);
        }

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

//TODO: Figure out a way to mark "readOnly" fields from the sudoku puzzle

let selectedCell = null;
let isPencilEnabled = false;

function setSelectedCell(element) {
    if (!element) return;

    if (selectedCell != null) {
        selectedCell.classList.remove("CellActive");
    }

    selectedCell = element;
    highlightSelectedCell();
    selectedCell.classList.add("CellActive");
}

function highlightSelectedCell() {
    //No need to do additional checks here due to call order

    //Group
    selectedCell.parentElement.classList.add("CellSubActive");

    //Find current group/cell index
    let groupIndex = -1;
    let cellIndex = -1;
    for (let i = 0; i < 9; i++) {
        if (selectedCell.parentElement == grid.children[i]) {
            groupIndex = i;

            for (let j = 0; j < 9; j++) {
                if (selectedCell == grid.children[i].children[j])
                    cellIndex = j;
            }
        }
    }
    //How can it ever be -1?
    if (groupIndex == -1 || cellIndex == -1) return;

    //Clear board beforehand
    for (let i = 0; i < 9; i++) {
        //Groups
        grid.children[i].classList.remove("CellSubActive");

        //Cells
        for (let j = 0; j < 9; j++)
            grid.children[i].children[j].classList.remove("CellSubActive");
    }

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
}

function setSelectedCellValue(value) {
    if (selectedCell == null) return;

    //Eraser will set the value to null
    if (!isPencilEnabled || value == null) {
        //Remove any pencil notes that could be present
        for (let i = 1; i < 10; i++)
            selectedCell.children[i].classList.add("hidden-pen");
        selectedCell.children[0].innerHTML = value;
    } else {
        //Remove any value that could be present
        selectedCell.children[0].innerHTML = null;

        if (selectedCell.children[value].classList.contains("hidden-pen"))
            selectedCell.children[value].classList.remove("hidden-pen");
        else
            selectedCell.children[value].classList.add("hidden-pen");
    }
}
