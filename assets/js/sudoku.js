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

        controlNumbers.append(numbers);
    }

    options.append(controlNumbers);

    //Mode Selection
    let controlOptions = document.createElement("div");
    controlOptions.classList.add("ControlOptions");

    let pencil = document.createElement("div");
    pencil.classList.add("Modes");
    pencil.textContent = "Pencil";
    pencil.style.gridArea = "Pencil";

    controlOptions.append(pencil);

    let eraser = document.createElement("div");
    eraser.classList.add("Modes");
    eraser.textContent = "Erase";
    eraser.style.gridArea = "Eraser";

    controlOptions.append(eraser);

    options.append(controlOptions);
}
