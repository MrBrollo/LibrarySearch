import _ from 'lodash';

document.getElementById('searchButton').addEventListener('click', function () {
    const category = document.getElementById('category').value;
    if (category) {
        fetchBooks(category);
    } else {
        alert('Please, insert a valid category.');
    }
});

//funzione per fetch API ed estrarre la categoria
async function fetchBooks(category) {
    const apiUrl = `https://openlibrary.org/subjects/${category}.json`;
    const headers = new Headers({
        "User-Agent": "librarySearch/1.0 (matteo.ricci0304@gmail.com)"
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const books = _.get(data, 'works', []);
        displayResults(books);
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while fetching book data. Please try again later.');
    }
}

//funzione per mostrare i risultati in un div creato appositamente
function displayResults(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (books.length === 0) {
        resultsDiv.innerHTML = '<p>No book has been found for this category.</p>';
        return;
    }

    //funzione per ottenere il titolo
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book';

        const titleElement = document.createElement('h3');
        titleElement.textContent = _.get(book, 'title', 'No title available');
        bookElement.appendChild(titleElement);

        const descriptionButton = document.createElement('button');
        descriptionButton.textContent = 'Show Description';
        descriptionButton.addEventListener('click', function () {
            toggleDescription(book.key, bookElement, descriptionButton);
        });
        bookElement.appendChild(descriptionButton);

        //funzione per ottenere gli autori
        const authors = _.get(book, 'authors', []);
        authors.forEach(author => {
            const authorElement = document.createElement('p');
            authorElement.textContent = `Author: ${_.get(author, 'name', 'Unknown author')}`;
            bookElement.appendChild(authorElement);
            authorElement.appendChild(descriptionButton);
        });

        resultsDiv.appendChild(bookElement);
    });
}

//funzione per ottenere la descrizione + pulsante 'hide' e 'show description'
function toggleDescription(bookKey, bookElement, button) {
    let descriptionElement = bookElement.querySelector('.description');
    if (descriptionElement) {
        if (descriptionElement.style.display === 'none') {
            descriptionElement.style.display = 'block';
            button.textContent = 'Hide Description';
        } else {
            descriptionElement.style.display = 'none';
            button.textContent = 'Show Description';
        }
    } else {
        fetchDescription(bookKey, bookElement, button);
    }
}

async function fetchDescription(bookKey, bookElement, button) {
    const apiUrl = `https://openlibrary.org${bookKey}.json`;
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const description = _.get(data, 'description.value', 'No description available.');
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'description';
        descriptionElement.textContent = description;
        bookElement.appendChild(descriptionElement);
        button.textContent = 'Hide Description';
    } catch (error) {
        console.error('Fetch description error:', error);
        alert('An error occurred while fetching the book description. Please try again later.');
    }
}