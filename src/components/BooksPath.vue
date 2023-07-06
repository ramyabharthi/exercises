<template>
    <div class="container">
      <div class="row">
        <div class="col-sm-10">
          <h1>Books</h1>
          <AlertPath :message="message" v-if="showMessage" />
          <hr><br><br>
          <button
            type="button"
            class="btn btn-success btn-sm"
            @click="toggleAddBookModal">
            Add Book
          </button>
          <br><br>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Read?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(book, index) in books" :key="index">      <!-- book in books -->
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>
                  <span v-if="book.read">Yes</span>
                  <span v-else>No</span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-warning btn-sm" @click="toggleEditBookModal(book)">Update</button>
                    <button type="button" class="btn btn-danger btn-sm" @click="handleDeleteBook(book)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- add new book modal -->
      <div
        ref="addBookModal"
        class="modal fade"
        :class="{ show: activeAddBookModal, 'd-block': activeAddBookModal }"
        tabindex="-1"
        role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Book</h5>
              <button type="button" class="close" @click="toggleAddBookModal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="addBookTitle">Title</label>
                  <input type="text" class="form-control" id="addBookTitle" v-model="addBookForm.title">
                </div>
                <div class="form-group">
                  <label for="addBookAuthor">Author</label>
                  <input type="text" class="form-control" id="addBookAuthor" v-model="addBookForm.author">
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="addBookRead" v-model="addBookForm.read">
                    <label class="form-check-label" for="addBookRead">Read</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="handleAddReset">Reset</button>
              <button type="button" class="btn btn-primary" @click="handleAddSubmit">Add</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- edit book modal -->
      <div
        ref="editBookModal"
        class="modal fade"
        :class="{ show: activeEditBookModal, 'd-block': activeEditBookModal }"
        tabindex="-1"
        role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Book</h5>
              <button type="button" class="close" @click="toggleEditBookModal(null)">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="editBookTitle">Title</label>
                  <input type="text" class="form-control" id="editBookTitle" v-model="editBookForm.title">
                </div>
                <div class="form-group">
                  <label for="editBookAuthor">Author</label>
                  <input type="text" class="form-control" id="editBookAuthor" v-model="editBookForm.author">
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="editBookRead" v-model="editBookForm.read">
                    <label class="form-check-label" for="editBookRead">Read</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="handleEditCancel">Cancel</button>
              <button type="button" class="btn btn-primary" @click="handleEditSubmit">Update</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal backdrop -->
      <div v-if="activeAddBookModal || activeEditBookModal" class="modal-backdrop fade show"></div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import AlertPath from '../components/AlertPath.vue';
  
  export default {
    data() {
      return {
        activeAddBookModal: false,
        activeEditBookModal: false,
        addBookForm: {
          title: '',
          author: '',
          read: [],
        },
        editBookForm: {
          id: '',
          title: '',
          author: '',
          read: [],
        },
        books: [],
        message: '',
        showMessage: false,
      };
    },
    components: {
      AlertPath,
    },
    methods: {
      addBook(payload) {
        const path = 'http://localhost:5000/books';
        axios.post(path, payload)
          .then(() => {
            this.getBooks();
            this.message = 'Book added!';     
            this.showMessage = true;
          })
          .catch((error) => {
            console.error(error);
            this.getBooks();
          });
      },
      getBooks() {
        const path = 'http://localhost:5000/books';
        axios.get(path)
          .then((res) => {
            this.books = res.data.books;
          })
          .catch((error) => {
            console.error(error);
          });
      },
      handleAddReset() {
        this.initForm();
      },
      handleAddSubmit() {                    //maranthuratha rendu irrukum 
        this.toggleAddBookModal();
        let read = false;
        if (this.addBookForm.read[0]) {
          read = true;
        }
        const payload = {
          title: this.addBookForm.title,
          author: this.addBookForm.author,
          read, // property shorthand
        };
        this.addBook(payload);
        this.initForm();
      },
      handleEditSubmit() {
        this.toggleEditBookModal(null);
        let read = false;
        if (this.editBookForm.read[0]) {
          read = true;
        }
        const payload = {
          title: this.editBookForm.title,
          author: this.editBookForm.author,
          read, // property shorthand
        };
        this.updateBook(payload, this.editBookForm.id);
      },
      handleEditCancel() {
        this.toggleEditBookModal(null);
        this.initForm();
      },
      handleDeleteBook(book) {
        this.removeBook(book.id);
      },
      removeBook(bookID) {
        const path = `http://localhost:5000/books/${bookID}`;
        axios.delete(path)
          .then(() => {
            this.getBooks();
            this.message = 'Book removed!';
            this.showMessage = true;
          })
          .catch((error) => {
            console.error(error);
            this.getBooks();
          });
      },
      initForm() {
        this.addBookForm.title = '';
        this.addBookForm.author = '';
        this.addBookForm.read = [];
        this.editBookForm.id = '';
        this.editBookForm.title = '';
        this.editBookForm.author = '';
        this.editBookForm.read = [];
      },
      toggleAddBookModal() {
        const body = document.querySelector('body');
        this.activeAddBookModal = !this.activeAddBookModal;
        if (this.activeAddBookModal) {
          body.classList.add('modal-open');
        } else {
          body.classList.remove('modal-open');
        }
      },
      toggleEditBookModal(book) {
        if (book) {
          this.editBookForm = book;
        }
        const body = document.querySelector('body');
        this.activeEditBookModal = !this.activeEditBookModal;
        if (this.activeEditBookModal) {
          body.classList.add('modal-open');
        } else {
          body.classList.remove('modal-open');
        }
      },
      updateBook(payload, bookID) {
        const path = `http://localhost:5000/books/${bookID}`;
        axios.put(path, payload)
          .then(() => {
            this.getBooks();
            this.message = 'Book updated!';
            this.showMessage = true;
          })
          .catch((error) => {
            console.error(error);
            this.getBooks();
          });
      },
    },
    created() {
      this.getBooks();
    },
  };
  </script>
  
  <style scoped>
  .modal.show {
    display: block;
    background: rgba(0, 0, 0, 0.5);
  }
  .modal.fade.show {
    opacity: 1;
  }
  </style>
  