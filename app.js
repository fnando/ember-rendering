var App = Em.Application.create();

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.FIXTURES;
  }
});

App.IndexController = Ember.ObjectController.extend({
  isRenderingWithBound: Em.computed.equal('renderType', 'bound'),
  isRenderingWithUnbound: Em.computed.equal('renderType', 'unbound'),
  isRenderingWithWorker: Em.computed.equal('renderType', 'worker'),
  isRenderingWithReact: Em.computed.equal('renderType', 'react'),

  renderWithWorker: function() {
    if (!this.get('isRenderingWithWorker')) {
      return;
    }

    var worker = new Worker('worker.js');

    worker.onmessage = function(event) {
      this.set('tableContents', event.data);
    }.bind(this);

    worker.postMessage(this.get('values'));
  }.observes('renderType'),

  actions: {
    setRenderType: function(type) {
      this.set('renderType', type);
    }
  }
});

App.TableContentsComponent = Em.Component.extend({
  tagName: 'tbody',

  didInsertElement: function() {
    var container = this.$().get(0);
    var tableContents = React.createElement(App.TableContents, {values: this.get('values')});
    var component = React.render(tableContents, container);
    this.set('reactComponent', component);
  },

  willDestroyElement: function() {
    React.unmountComponentAtNode(this.$().get(0));
  }
});

App.TableContents = React.createClass({
  render: function() {
    var rows = this.props.values.map(function(row, id){
      return this.createRow(row, id);
    }, this);

    return React.createElement('tbody', {className: 'created-with-react'}, rows);
  },

  createRow: function(row, id) {
    var cols = row.map(function(column, id){
      return this.createColumn(column, id)
    }, this);

    return React.createElement('tr', {key: id}, cols);
  },

  createColumn: function(column, id) {
    return React.createElement('td', {key: id}, column);
  }
});
