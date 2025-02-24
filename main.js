let BookList = []; //BookList array

function validateInputs(title, price, authorName, authorEmail) {
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });

    // Title validation
    if (!/^[A-Za-z\s]+$/.test(title)) {
        document.getElementById('titleError').textContent = 'Title must contain only letters and spaces.';
        document.getElementById('titleError').style.display = 'block';
        isValid = false;
    }

    // Price validation
    if (!/^\d+$/.test(price)) {
        document.getElementById('priceError').textContent = 'Price must be a number.';
        document.getElementById('priceError').style.display = 'block';
        isValid = false;
    }

    // Author name validation
    if (!/^[A-Za-z\s]+$/.test(authorName)) {
        document.getElementById('authorNameError').textContent = 'Author name must contain only letters and spaces.';
        document.getElementById('authorNameError').style.display = 'block';
        isValid = false;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
        document.getElementById('authorEmailError').textContent = 'Please enter a valid email address.';
        document.getElementById('authorEmailError').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

document.getElementById('submitButton').addEventListener('click', function () {
    const bookNumberInput = document.getElementById('bookNumber');
    const errorMessage = document.getElementById('errorMessage');
    const inputValue = bookNumberInput.value.trim();

    if (isNaN(inputValue) || inputValue === '') {
        errorMessage.textContent = 'Please enter a valid number.';
        errorMessage.style.display = 'block';
        bookNumberInput.classList.add('shake');
        bookNumberInput.addEventListener('animationend', () => {
            bookNumberInput.classList.remove('shake');
        }, { once: true });
        return;
    }

    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    document.getElementById('bookInputCard').remove();
    document.getElementById('bookDetailsContainer').style.display = 'block';

    let currentBook = 1;
    const totalBooks = parseInt(inputValue);

    document.getElementById('nextBookButton').addEventListener('click', function () {
        const title = document.getElementById('bookTitle').value.trim();
        const price = document.getElementById('bookPrice').value.trim();
        const authorName = document.getElementById('authorName').value.trim();
        const authorEmail = document.getElementById('authorEmail').value.trim();

        if (validateInputs(title, price, authorName, authorEmail)) {
            // Add to BookList
            const book = new Book(title, price, new Author(authorName, authorEmail));
            BookList.push(book);

            // Clear inputs
            document.getElementById('bookTitle').value = '';
            document.getElementById('bookPrice').value = '';
            document.getElementById('authorName').value = '';
            document.getElementById('authorEmail').value = '';

            currentBook++;

            if (currentBook > totalBooks) {
                console.log('Book List:', BookList);
                alert('All books submitted successfully!');
                document.getElementById('bookDetailsContainer').style.display = 'none';
                document.getElementById('booksTableContainer').style.display = 'block';
                renderBooksTable();
            } else {
                document.getElementById('currentBookNumber').textContent = `Book ${currentBook}`;
            }
        }
    });
});

function renderBooksTable() {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';

    BookList.forEach((book, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>${book.author.name}</td>
            <td>${book.author.email}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', function () {
            BookList.splice(index, 1);
            renderBooksTable();
        });

        row.querySelector('.edit-btn').addEventListener('click', function () {
            enterEditMode(row, index);
        });

        tbody.appendChild(row);
    });
}

function enterEditMode(row, index) {
    const cells = row.cells;
    const book = BookList[index];

    // Save original values
    const originalValues = {
        title: cells[0].textContent,
        price: cells[1].textContent,
        authorName: cells[2].textContent,
        authorEmail: cells[3].textContent
    };

    // Convert cells to inputs and add error message containers
    cells[0].innerHTML = `
        <input type="text" value="${originalValues.title}">
        <div class="error-message" id="editTitleError"></div>
    `;
    cells[1].innerHTML = `
        <input type="text" value="${originalValues.price}">
        <div class="error-message" id="editPriceError"></div>
    `;
    cells[2].innerHTML = `
        <input type="text" value="${originalValues.authorName}">
        <div class="error-message" id="editAuthorNameError"></div>
    `;
    cells[3].innerHTML = `
        <input type="email" value="${originalValues.authorEmail}">
        <div class="error-message" id="editAuthorEmailError"></div>
    `;

    // Change actions to Save/Cancel
    cells[4].innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;

    // Handle Save
    cells[4].querySelector('.save-btn').addEventListener('click', function () {
        const newTitle = cells[0].querySelector('input').value.trim();
        const newPrice = cells[1].querySelector('input').value.trim();
        const newAuthorName = cells[2].querySelector('input').value.trim();
        const newAuthorEmail = cells[3].querySelector('input').value.trim();

        // Reset error messages
        document.querySelectorAll('#editTitleError, #editPriceError, #editAuthorNameError, #editAuthorEmailError').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        // Validate inputs
        let isValid = true;

        // Title validation
        if (!/^[A-Za-z\s]+$/.test(newTitle)) {
            document.getElementById('editTitleError').textContent = 'Title must contain only letters and spaces.';
            document.getElementById('editTitleError').style.display = 'block';
            isValid = false;
        }

        // Price validation
        if (!/^\d+$/.test(newPrice)) {
            document.getElementById('editPriceError').textContent = 'Price must be a number.';
            document.getElementById('editPriceError').style.display = 'block';
            isValid = false;
        }

        // Author name validation
        if (!/^[A-Za-z\s]+$/.test(newAuthorName)) {
            document.getElementById('editAuthorNameError').textContent = 'Author name must contain only letters and spaces.';
            document.getElementById('editAuthorNameError').style.display = 'block';
            isValid = false;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAuthorEmail)) {
            document.getElementById('editAuthorEmailError').textContent = 'Please enter a valid email address.';
            document.getElementById('editAuthorEmailError').style.display = 'block';
            isValid = false;
        }

        // If all inputs are valid, save changes
        if (isValid) {
            book.title = newTitle;
            book.price = newPrice;
            book.author.name = newAuthorName;
            book.author.email = newAuthorEmail;
            renderBooksTable();
        }
    });

    // Handle Cancel
    cells[4].querySelector('.cancel-btn').addEventListener('click', function () {
        renderBooksTable();
    });
}

// Classes
function Book(title, price, author) {
    this.title = title;
    this.price = price;
    this.author = author;
}

function Author(name, email) {
    this.name = name;
    this.email = email;
}