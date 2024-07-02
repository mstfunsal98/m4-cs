document.addEventListener('DOMContentLoaded', () => {
    const addRowBtn = document.getElementById('addRow');
    const deleteRowBtn = document.getElementById('deleteRow');
    const boldTextBtn = document.getElementById('boldText');
    const saveBtn = document.getElementById('save');
    const table = document.getElementById('spreadsheet');
    
    let selectedCells = [];

    addRowBtn.addEventListener('click', () => {
        const row = table.insertRow();
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            const cell = row.insertCell();
            cell.contentEditable = "true";
            cell.addEventListener('click', selectCell);
        }
    });

    deleteRowBtn.addEventListener('click', () => {
        if (table.rows.length > 2) {
            table.deleteRow(-1);
        }
    });

    boldTextBtn.addEventListener('click', () => {
        selectedCells.forEach(cell => {
            cell.style.fontWeight = cell.style.fontWeight === 'bold' ? 'normal' : 'bold';
        });
    });

    saveBtn.addEventListener('click', () => {
        const data = [];
        for (let i = 1; i < table.rows.length; i++) {
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

    // Load saved data
    const savedData = JSON.parse(localStorage.getItem('spreadsheetData'));
    if (savedData) {
        for (let i = 0; i < savedData.length; i++) {
            if (i >= table.rows.length - 1) addRowBtn.click();
            for (let j = 0; j < savedData[i].length; j++) {
                table.rows[i + 1].cells[j].innerText = savedData[i][j];
            }
        }
    }
});
