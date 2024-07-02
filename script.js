document.addEventListener('DOMContentLoaded', () => {
    const addRowBtn = document.getElementById('addRow');
    const deleteRowBtn = document.getElementById('deleteRow');
    const addColumnBtn = document.getElementById('addColumn');
    const boldTextBtn = document.getElementById('boldText');
    const saveBtn = document.getElementById('save');
    const table = document.getElementById('spreadsheet');
    
    let selectedCells = [];

    addRowBtn.addEventListener('click', () => {
        const row = table.insertRow();
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            const cell = row.insertCell();
            cell.contentEditable = "true";
            cell.style.border = "1px solid #ddd";
            cell.style.padding = "10px";
            cell.addEventListener('click', selectCell);
        }
    });

    deleteRowBtn.addEventListener('click', () => {
        if (table.rows.length > 2) {
            table.deleteRow(-1);
        }
    });

    addColumnBtn.addEventListener('click', () => {
        const header = table.rows[0];
        const headerCell = document.createElement('th');
        headerCell.contentEditable = "true";
        headerCell.style.border = "1px solid #ddd";
        headerCell.style.padding = "10px";
        headerCell.style.backgroundColor = "#f0f0f0";
        headerCell.style.position = "relative";

        const columnIndex = header.cells.length;

        const headerButtons = document.createElement('div');
        headerButtons.className = 'header-buttons';
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '>';
        increaseBtn.dataset.index = columnIndex;
        increaseBtn.addEventListener('click', () => adjustColumnWidth(columnIndex, 10));
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '<';
        decreaseBtn.dataset.index = columnIndex;
        decreaseBtn.addEventListener('click', () => adjustColumnWidth(columnIndex, -10));
        
        headerButtons.appendChild(increaseBtn);
        headerButtons.appendChild(decreaseBtn);

        headerCell.appendChild(headerButtons);
        headerCell.appendChild(document.createTextNode('Başlık ' + (columnIndex + 1)));

        header.appendChild(headerCell);

        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const cell = document.createElement('td');
            cell.contentEditable = "true";
            cell.style.border = "1px solid #ddd";
            cell.style.padding = "10px";
            cell.addEventListener('click', selectCell);
            row.appendChild(cell);
        }
    });

    boldTextBtn.addEventListener('click', () => {
        selectedCells.forEach(cell => {
            cell.style.fontWeight = cell.style.fontWeight === 'bold' ? 'normal' : 'bold';
        });
    });

    saveBtn.addEventListener('click', () => {
        const data = [];
        for (let i = 0; i < table.rows.length; i++) {
            const row = [];
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                row.push(table.rows[i].cells[j].innerText);
            }
            data.push(row);
        }
        localStorage.setItem('spreadsheetData', JSON.stringify(data));
        alert('Data saved!');
    });

    function selectCell(event) {
        const cell = event.target;
        if (cell.classList.contains('selected')) {
            cell.classList.remove('selected');
            selectedCells = selectedCells.filter(c => c !== cell);
        } else {
            cell.classList.add('selected');
            selectedCells.push(cell);
        }
    }

    function adjustColumnWidth(colIndex, amount) {
        table.querySelectorAll(`tr`).forEach(row => {
            const cell = row.cells[colIndex];
            const newWidth = (cell.offsetWidth || 100) + amount;
            cell.style.width = `${newWidth}px`;
        });
    }

    const savedData = JSON.parse(localStorage.getItem('spreadsheetData'));
    if (savedData) {
        for (let i = 0; i < savedData.length; i++) {
            if (i >= table.rows.length - 1) addRowBtn.click();
            for (let j = 0; j < savedData[i].length; j++) {
                if (j >= table.rows[i + 1].cells.length) addColumnBtn.click();
                table.rows[i + 1].cells[j].innerText = savedData[i][j];
            }
        }
    }

    document.querySelectorAll('th').forEach((th, index) => {
        const headerButtons = document.createElement('div');
        headerButtons.className = 'header-buttons';
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '>';
        increaseBtn.dataset.index = index;
        increaseBtn.addEventListener('click', () => adjustColumnWidth(index, 10));
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '<';
        decreaseBtn.dataset.index = index;
        decreaseBtn.addEventListener('click', () => adjustColumnWidth(index, -10));
        
        headerButtons.appendChild(increaseBtn);
        headerButtons.appendChild(decreaseBtn);

        th.insertBefore(headerButtons, th.firstChild);
    });
});
