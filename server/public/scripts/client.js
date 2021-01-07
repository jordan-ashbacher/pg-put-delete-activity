$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.delete-btn', deleteBook)
  $('#bookShelf').on('click', '.status-btn', updateStatus)
  $('#bookShelf').on('click', '.edit-btn', editMode)
  $('#input-section').on('click', '#cancel-btn', cancelEdit)

  // TODO - Add code for edit & delete buttons
}

let bookId
let currentMode = 'add'

function editMode() {
  console.log('clicked edit book')
  bookId = $(this).closest('tr').data('id')
  console.log(bookId)
  currentMode = 'edit'

  $('#title').val($(this).siblings('td.title').text())
  $('#author').val($(this).siblings('td.author').text())
  $('#input-header').text('Edit Book')
  $('#input-section').append(`<button type="button" id="cancel-btn">Cancel</button>`)
}

function cancelEdit() {
  console.log('clicked cancel')
  currentMode = 'add'
  $('#title').val('')
  $('#author').val('')
  $('#input-header').text('Add New Book')
  $('#cancel-btn').remove()
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  if (currentMode === 'add') {
    addBook(book);
  } else if (currentMode === 'edit') {
    editBook(book)
  }
  
}

function editBook(bookToEdit) {
  console.log('book to edit', bookToEdit)
  $.ajax({
    type: 'PUT',
    url: `/books/edit/${bookId}`,
    data: bookToEdit
  }).then(function (response) {
    refreshBooks()
  }).catch(function (err) {
    alert('error editing book')
  })
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $(`<tr data-id=${book.id}></tr>`);
    $tr.data('book', book);
    $tr.append(`<td class="title">${book.title}</td>`);
    $tr.append(`<td class="author">${book.author}</td>`);
    $tr.append(`<td class="status">${book.status}</td>`);
    $tr.append(`<button class='status-btn'>UPDATE STATUS</button>`)
    $tr.append(`<button class='edit-btn'>EDIT</button>`)
    $tr.append(`<button class='delete-btn'>DELETE</button>`)
    $('#bookShelf').append($tr);
  }
}

function deleteBook() {
  console.log('delete button clicked')
  const id = $(this).closest('tr').data('id')

  $.ajax({
    type: 'DELETE',
    url: `/books/${id}`
  }).then(function (response) {
    refreshBooks()
  }).catch(function (err) {
    console.log('error deleting book')
  })
}

function updateStatus() {
  console.log('status button clicked')
  const id = $(this).closest('tr').data('id')
  const currentStatus = $(this).siblings('td.status').text()
  console.log(currentStatus)
  const dataToSend = {
    status: currentStatus
  }

  $.ajax({
    type: 'PUT',
    url: `/books/${id}`,
    data: dataToSend
  }).then(function (response) {
    refreshBooks()
  }).catch(function (err) {
    alert('error changing status')
  })

}
