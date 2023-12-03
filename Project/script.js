document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemsPerPage = 10;

    // Function to fetch data from the API
    async function fetchData() {
        try {
            const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to populate the table with fetched data
    async function populateTable() {
        const users = await fetchData();

        if (users && users.length > 0) {
            tableBody.innerHTML = '';

            // Loop through fetched data and create table rows with checkboxes
            users.forEach((user, index) => {
                const row = `
                    <tr>
                        <td><input type="checkbox" id="checkbox${index + 1}" class="checkbox"></td>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="edit">Edit</button>
                            <button class="delete">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="6">No data available</td></tr>';
        }

        initializePagination(); // Initialize pagination after table population
    }

    // Function to display rows for pagination
    function displayRows(pageNumber) {
        const rows = tableBody.querySelectorAll('tr');
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        rows.forEach((row, index) => {
            if (index >= startIndex && index < endIndex) {
                row.classList.add('visible-row');
            } else {
                row.classList.remove('visible-row');
            }
        });
    }

  // Function to display rows for pagination
function displayRows(pageNumber) {
    const rows = tableBody.querySelectorAll('tr');
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    rows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.classList.add('visible-row');
        } else {
            row.classList.remove('visible-row');
        }
    });
}

// Function to initialize pagination
function initializePagination() {
    const rows = tableBody.querySelectorAll('tr');
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / itemsPerPage);

    // Hide all rows initially
    rows.forEach(row => {
        row.style.display = 'none';
    });

    // Show the first set of rows (first page)
    for (let i = 0; i < itemsPerPage; i++) {
        if (rows[i]) {
            rows[i].style.display = '';
        }
    }

    // Initialize pagination
    $('#pagination').pagination({
        items: totalRows,
        itemsOnPage: itemsPerPage,
        displayedPages: 3,
        edges: 1,
        onPageClick: function (pageNumber) {
            const startIndex = (pageNumber - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            // Hide all rows
            rows.forEach(row => {
                row.style.display = 'none';
            });

            // Show the rows for the selected page
            for (let i = startIndex; i < endIndex && i < totalRows; i++) {
                rows[i].style.display = '';
            }
        }
    });
}

    // Event listener for search button click
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.toLowerCase();
        filterTable(searchTerm);
    });

    // Function to filter table based on search term
    function filterTable(searchTerm) {
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    // Event listener for handling edit and delete buttons
    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit')) {
            const row = event.target.closest('tr');
            const cells = row.querySelectorAll('td:not(:last-child)');

            cells.forEach(cell => {
                const text = cell.innerText;
                cell.innerHTML = `<input type="text" value="${text}">`;
            });

            event.target.innerText = 'Save';
            event.target.classList.remove('edit');
            event.target.classList.add('save');
        } else if (event.target.classList.contains('save')) {
            const row = event.target.closest('tr');
            const cells = row.querySelectorAll('td:not(:last-child)');

            cells.forEach(cell => {
                const text = cell.querySelector('input').value;
                cell.innerHTML = text;
            });

            event.target.innerText = 'Edit';
            event.target.classList.remove('save');
            event.target.classList.add('edit');
        } else if (event.target.classList.contains('delete')) {
            const row = event.target.closest('tr');
            deleteRow(row);
        }
    });

    // Function to delete a row
    function deleteRow(row) {
        row.remove();
    }

    // Event listener for select/deselect all
    selectAllCheckbox.addEventListener('change', function () {
        const checkboxes = tableBody.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    // Event listener for select/deselect all and individual checkboxes

    tableBody.addEventListener('change', function (event) {
        const checkboxes = tableBody.querySelectorAll('.checkbox');
        const selectedRowCountElement = document.getElementById('selectedRowCount');
        let selectedRowCount = 0;
    
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedRowCount++;
            }
        });
    
        selectedRowCountElement.textContent = `${selectedRowCount} row${selectedRowCount !== 1 ? 's' : ''} selected`;
    });
    

    // Initial table population
    populateTable(); // Call populateTable() to start fetching and populating data
});
