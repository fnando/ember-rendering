importScripts('bower_components/handlebars/handlebars.js');

onmessage = function(event) {
  var html = '';
  var values = event.data;

  values.forEach(function(row){
    html += '<tr>';

    row.forEach(function(column){
      html += '<td>';
      html += Handlebars.Utils.escapeExpression(column);
      html += '</td>';
    });

    html += '</tr>';
  });

  postMessage(html);
};
