// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
   
    }

    static addBookToList(book) {
        const list = document.querySelector('.tbody');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn-delete">X</a></td>
        `

        list.appendChild(row);
    }


    static deleteBook(e) {
        if (e.classList.contains('btn-delete')) {
            e.parentElement.parentElement.remove();
        }
    }


    static showAlert(message, className) {
        // Create a div element
        const div = document.createElement('div');

        // Give a class name to the div
        div.className = `alert ${className}`;

        // Append the message to the div
        div.appendChild(document.createTextNode(message));

        // Grab the container element and the form element
        const container = document.querySelector('.container');
        const form = document.querySelector('.form-group');

        // Insert the div before the form at the container section
        container.insertBefore(div, form);

        // Disappear in three seconds
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 2000)
    }

    static clearFields() {
        title.value = ''
        author.value = ''
        isbn.value = ''
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books
    }

    static addBooks(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event: Displays Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a Book
const form = document.querySelector('.form-group');

form.addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (!title || !author || !isbn) {
        // Display error message when something is not right
        UI.showAlert('Please, enter all fields', 'danger');
    } else {
        // Instantiate
        const book = new Book(title, author, isbn);
        
        // Add Book to the UI
        UI.addBookToList(book)

        // Add Book to Store
        Store.addBooks(book);
        
        // Display success message when all the fields are correctly filled 
        UI.showAlert('Book Added', 'success');
        
        // Clear Fields
        UI.clearFields()

    }


});


// Event Remove a Book
const bookList = document.querySelector('.tbody');

bookList.addEventListener('click', (e) => {
    // Remove Book from UI
    UI.deleteBook(e.target);

    // Remove Book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show message when a book is removed
    UI.showAlert('Book Removed', 'attention')
})