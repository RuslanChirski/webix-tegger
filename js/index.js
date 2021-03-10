class Tegger {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this._tegs = [];
    this._isReadOnly = false;
    this._isEmptyMsg = false;
    this._render();
    this._setup();
  }

  get _isEmpty() {
    return !this._tegs.length;
  }

  get tegs() {
    return this._tegs;
  }

  set tegs(tegList) {
    tegList.forEach((item) => this.addTeg(item));
  }

  _render() {
    this.el.classList.add('tegger');
    this.el.innerHTML = this._getTemplate();
  }

  _getTemplate() {
    return `
        <div class="tegger__add-wrap">
          <input class="tegger__input" type="text" />
          <button class="tegger__add-btn" data-type="add">Add</button>
        </div>
        <div class="tegger__teg-container">
        </div>
        <label class="tegger__readonly">
          Read-only
          <input type="checkbox" />
        </label>
    `;
  }

  _setup() {
    this._clickHandler = this._clickHandler.bind(this);
    this.toggleIsReadOnly = this.toggleIsReadOnly.bind(this);

    this.textInput = this.el.querySelector('.tegger__input');
    this.readOnlyInput = this.el.querySelector('input[type = "checkbox"]');
    this.container = this.el.querySelector('.tegger__teg-container');
    this.addBtn = this.el.querySelector('.tegger__add-btn');

    this.el.addEventListener('click', this._clickHandler);
    this.readOnlyInput.addEventListener('change', this._toggleIsReadOnly);

    this._getFromLocalStorage();
    this._checkIsEmpty();
  }

  addTeg(text) {
    const newTeg = this._createTeg(text);
    this._tegs.push(text);
    this._checkIsEmpty();
    this.container.appendChild(newTeg);
    this._setToLocalStorage();
    this._clear();
    this.textInput.focus();
  }

  _checkIsEmpty() {
    if (this._isEmpty) {
      this._addIsEmptyMsg();
    } else {
      this._deleteIsEmptyMsg();
    }
  }

  _addIsEmptyMsg() {
    this._isEmptyMsg = true;
    this.container.innerHTML = '<p>Teg list is empty</p>';
  }

  _deleteIsEmptyMsg() {
    if (this._isEmptyMsg) {
      this._isEmptyMsg = false;
      this.container.innerHTML = '';
    }
  }

  deleteTeg(event) {
    const currentTegNode = event.target.closest('.tegger__item');
    const currentTegValue = currentTegNode.innerText;
    this._tegs = this._tegs.filter((item) => item !== currentTegValue);
    currentTegNode.remove();
    this._setToLocalStorage();
    this._checkIsEmpty();
  }

  _createTeg(text) {
    const newTeg = document.createElement('div');
    newTeg.classList.add('tegger__item');
    newTeg.innerHTML = `<span>${text}</span> <button class="tegger__delete-btn" data-type="delete"><i data-type="delete" class="fas fa-times" ></i></button>`;
    return newTeg;
  }

  _clear() {
    this.textInput.value = '';
  }

  toggleIsReadOnly() {
    this.isReadOnly = !this.isReadOnly;
    this.readOnlyInput.checked = this.isReadOnly;
    this.addBtn.disabled = this.isReadOnly;
    this.el
      .querySelectorAll('.tegger__delete-btn')
      .forEach((btn) => (btn.disabled = this.isReadOnly));
  }

  _clickHandler(event) {
    if (this.isReadOnly) {
      return
    }

    const { type } = event.target.dataset;
    switch (type) {
      case 'add':
        const value = this.textInput.value.trim();
        if (!value) {
          return;
        }
        this.addTeg(value);
        break;
      case 'delete':
        this.deleteTeg(event);
        break;
    }
  }

  _setToLocalStorage() {
    localStorage.setItem('tegs', JSON.stringify(this._tegs));
  }

  _getFromLocalStorage() {
    const tegs = JSON.parse(localStorage.getItem('tegs')) || [];
    this.tegs = tegs;
  }
}

const tegger = new Tegger('#tegger');
