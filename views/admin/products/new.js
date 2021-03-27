const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
    return layout({
        // method (GET || POST) - how to transmit info
        // enctype - how to take info out of form and get it ready to transmitting
        // default  - "application/x-www-form-urlencoded" - take info from values of name properties
        // and put in string like format
        // "multipart/form-data" - for sending files
        content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Create a Product</h1>

          <form method="POST" enctype="multipart/form-data">
            <div class="field">
              <label class="label">Title</label>
              <input class="input" placeholder="Title" name="title">
              <p class="help is-danger">${getError(errors, 'title')}</p>
            </div>
            
            <div class="field">
              <label class="label">Price</label>
              <input class="input" placeholder="Price" name="price">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>
            
            <div class="field">
              <label class="label">Image</label>            
              <input type="file" name="image" />
            </div>
            <br />
            <button class="button is-primary">Create</button>
          </form>
        </div>
      </div>
    `
    })
}