$( document ).ready(function() {
  
  /*global io*/
  var socket=io()
 
  socket.on('user count', function (data) {
    console.log(data)
  });

  socket.on('user', function (data) {
    document.getElementById('num-users').innerText = data.currentUsers + ' users online'
    var message = data.name;
    if (data.connected) {
      message += ' has joined the chat.';
    } else {
      message += ' has left the chat.';
    }
    var ul = document.getElementById("messages");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(message));
    li.setAttribute("style", "font-weight:bold"); // added line
    ul.appendChild(li);
  });
 

  // Form submittion with new message in field with id 'm'
  $('form').submit(function(){
    var messageToSend = $('#m').val();
    //send message to server here?
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
  
  
  
});
