window.addEventListener('DOMContentLoaded', function () {
	'use strict';
	const form = document.getElementById('book-form');
	const bookList = document.getElementById('book-list');

	// constructor
	function Book(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}

	function UI() {}

	UI.prototype.addBook = function (book) {
		let row = document.createElement('tr');
		const ui = new UI();

		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="delete">X</a></td>
		`;
		bookList.append(row);
	};

	// remove book
	UI.prototype.removeBook = function (target) {
		target.parentElement.parentElement.remove();
	};

	// clear fields
	UI.prototype.clearFields = function () {
		document.getElementById('title').value = '';
		document.getElementById('author').value = '';
		document.getElementById('isbn').value = '';
	};

	class Store {
		static getBooks() {
			let books;
			if (localStorage.getItem('books') == null) {
				books = [];
			} else {
				books = JSON.parse(localStorage.getItem('books'));
			}
			return books;
		}

		static displayBooks() {
			const books = Store.getBooks();

			books.forEach(elem => {
				const ui = new UI();
				ui.addBook(elem);
			});
		}

		static addBook(book) {
			const books = Store.getBooks();
			books.push(book);
			localStorage.setItem('books', JSON.stringify(books));
		}

		static removeBook(isbn) {
			const books = Store.getBooks();
			books.forEach((elem, i) => {
				if (elem.isbn === isbn) {
					books.splice(i, 1);
				}
			});

			localStorage.setItem('books', JSON.stringify(books));
		}
	}


	Store.displayBooks();
	// add book on submit
	form.addEventListener('submit', function (e) {
		let title = document.getElementById('title').value;
		let author = document.getElementById('author').value;
		let isbn = document.getElementById('isbn').value;
		const book = new Book(title, author, isbn);
		const ui = new UI();

		if (
			title.length < 2 ||
			author.length < 2 ||
			isbn.length < 2
		) {
			console.log('type valid value');
		} else {
			ui.addBook(book);
			Store.addBook(book);
		}
		ui.clearFields();
		e.preventDefault();
	});

	// remove book on delete click
	bookList.addEventListener('click', function (e) {
		let target = e.target;
		const ui = new UI();
		if (target.className === 'delete') {
			ui.removeBook(target);
			Store.removeBook(target.parentElement.previousElementSibling.textContent);
		}
		e.preventDefault();
	});



});