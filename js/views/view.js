export default class View {
  _data;
  _bookmarked;

  render(data, render = true, bookmarked) {
    this._data = data;
    this._bookmarked = bookmarked;
    const markup = this._generateMarkup();
    //if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
