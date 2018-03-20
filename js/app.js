'use strict';

var author = [
  {
    name: '',
    last_name: '',
    birthday: '',
    age: ''
  }
];

var d = new Date();
var n = d.getFullYear();
window.ee = new EventEmitter();

var Article = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      last_name: React.PropTypes.string.isRequired,
      birthday: React.PropTypes.string.isRequired
    })
  },
  getInitialState: function() {
    return {
      visible: false
    };
  },
  readmoreClick: function(e) {
    e.preventDefault();
    this.setState({visible: true});
  },
  render: function() {
    var name = this.props.data.name,
        last_name = this.props.data.last_name,
        birthday = this.props.data.birthday,
        age = this.props.data.age,
        visible = this.state.visible;

    return (
      <div className='article'>
        <p className='news__author'>{name}</p>
        <p className='news__text'>{last_name}</p>
        <p className='news__text'>{birthday}</p>
        <p className='news__text'>{age}</p>
      </div>
    )
  }
});

var News = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  render: function() {
    var data = this.props.data;
    var newsTemplate;

    if (data.length > 0) {
      newsTemplate = data.map(function(item, index) {
        return (
          <div key={index}>
            <Article data={item} />
          </div>
        )
      })
    } else {
      newsTemplate = <p>Введіть данні!!!</p>
    }

    return (
      <div className='news'>
        {newsTemplate}
      </div>
    );
  }
});

var Add = React.createClass({
  getInitialState: function() {
    return {
      authorIsEmpty: true,
      textIsEmpty: true
    };
  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },
  onBtnClickHandler: function(e) {
    e.preventDefault();
    var textEl = ReactDOM.findDOMNode(this.refs.text);
    var birthdayEl = ReactDOM.findDOMNode(this.refs.birthday);

    var author = ReactDOM.findDOMNode(this.refs.author).value;
    var text = textEl.value;
    var birthday = birthdayEl.value;


    var item = [{
      name: author,
      last_name: text,
      birthday: birthday,
      age: n - birthday

    }];

    window.ee.emit('News.add', item);

    textEl.value = '';
    this.setState({textIsEmpty: true});
  },
  onFieldChange: function(fieldName, e) {
    if (e.target.value.trim().length > 0) {
      this.setState({[''+fieldName]:false})
    } else {
      this.setState({[''+fieldName]:true})
    }
  },
  render: function() {
    var agreeNotChecked = this.state.agreeNotChecked,
        authorIsEmpty = this.state.authorIsEmpty,
        textIsEmpty = this.state.textIsEmpty;
    return (
      <form className='add cf'>
        <input
          type='text'
          className='add__author'
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
          placeholder='Ваше імя'
          ref='author'
        />
        <textarea
          className='add__text'
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
          placeholder='Прізвище'
          ref='text'
        ></textarea>
        <textarea
          className='add__text'
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
          placeholder='Рік народження'
          ref='birthday'
        ></textarea>

        <button
          className='add__btn'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}
          >
          Ввести
        </button>
      </form>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      news: author
    };
  },
  componentDidMount: function() {
    var self = this;
    window.ee.addListener('News.add', function(item) {
      var nextNews = item.concat(self.state.news);
      self.setState({news: nextNews});
    });
  },
  componentWillUnmount: function() {
    window.ee.removeListener('News.add');
  },
  render: function() {
    console.log('render');
    return (
      <div className='app'>
        <Add />
        <h3>Введені данні</h3>
        <News data={this.state.news} />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
