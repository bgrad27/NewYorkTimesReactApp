import React, { Component } from 'react';
import './App.css'
import Home from './components/home';
import Saved from './components/saved';

class App extends Component {
  constructor() {
    super();

    this.state = {
      books: [{ _id: 1, name: 'book one' }, { _id: 2, name: 'book two' }],
      update: false,
      editBookId: 1
    }

  }

  componentDidMount() {
    // loadBooks()
    //   .then(resultingJSON => this.setState({books : resultingJSON}))

    this.loadBooks()
      .then(books => this.setState({ books }))

    this.loadBook('5ac51dd11598966454b2543b')
      .then(res => console.log('line 24', res));

  }

  deleteArticle = (event) => {
    event.preventDefault();

    const idDelete = event.target.getAttribute('data-id');
    // I want you to delete that book and update the state so that the book isn't there that was deleted

    //little hint, take a look at App.js's delete in the songs app

    //2:25

    fetch(`http://localhost:3002/api/articles/delete/${idDelete}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then((oldBookId) => {

        let books = this.state.books.filter((book, i) => book._id !== oldBookId)

        this.setState({
          books
        });
      })


  }

  loadBooks = () => {
    return fetch("http://localhost:3001/books")
      .then(res => res.json())
  }

  loadBook = (id) => {
    return fetch(`http://localhost:3001/book/${id}`)
      .then(res => res.json())
  }

  loadEditForm = (id) => {
    this.setState({ update: true }, () => {
      this.setState({ editBookId: id });

      let form = document.querySelector('#updateForm')

      let input = form.children[0];

      this.loadBook(id)
        .then(res => input.value = res[0].name);


    });
  }

  cancelEditForm = () => {
    this.setState({ update: false });
  }

  updateBook = (event) => {
    event.preventDefault();

    const name = event.target.children[0].value;

    const id = this.state.editBookId;

    fetch(`http://localhost:3001/book/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    }).then(res => res.json())
      .then((res) => {
        let books = this.state.books.map((b) => {
          if (b._id != id) return b;
          else return res;
        })
        this.setState({ books });
      });

  }

  submitBook = (event) => {
    event.preventDefault();

    const name = event.target.children[0].value;

    // {name: 'to kill a mockingbird'} 

    //instead of alerting the book name, make a fetch call to the post route in express and submit the book
    fetch("http://localhost:3001/booksinsert", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    }).then(res => res.json())
      .then((res) => {
        this.setState({ books: [...this.state.books, res] })

      });

    //after it's submitted, update books in state of this component

    //11:50
  }

  render() {

    return (
      <div className="App">
        hello world

        {/*make a form here that takes in a book and when you submit the form, alert what they put in there*/}
        <form onSubmit={this.submitBook}>
          <input type="text" placeholder="put in a book" />

          <input type="submit" value="submit book" />
        </form>

        <div id="left">
          {this.state.books.map((b) =>
            <p key={b._id}>
              {b._id} <br />
              {b.name}

              <button data-id={b._id} onClick={this.deleteArticle}>x</button>

              <button onClick={() => this.loadEditForm(b._id)}>edit</button>

            </p>
          )}
        </div>

        <div id="right">


          {(this.state.update) && <div><form id="updateForm" onSubmit={this.updateBook}>
            <input type="text" />
            <input type="hidden" value={this.state.editBookId} />

            <input type="submit" value="update this book" />
          </form><button onClick={this.cancelEditForm}>cancel</button></div>}

        </div>
      </div>
    );
  }
}
export default App;