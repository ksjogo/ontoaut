document.write("<textarea id='text'></textarea><br/>");
document.write("<input type='submit' onClick='document.send()' value='send'/>");

document.write("<div id='ontoaut'/>");
var ontoaut = require('./src/Ontoaut.js').default;
ontoaut.mount();
document.send = function(){
    ontoaut.send(document.getElementById('text'));
};
