var socket = io.connect('http://localhost:3000');

// submit text message without reload/refresh the page
document.querySelector("#button").addEventListener("click", (event) => {
    event.preventDefault(); // prevents page reloading
    socket.emit('send_chat_message', room, document.getElementById("userInput").value);
    socket.emit('chat_message', { message: document.getElementById("userInput").value, name: 'BOB' });
    document.getElementById("userInput").value = '';
});

//appends message to chat
socket.on('chat_message', (data) =>  {
    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    newSpan.setAttribute('class', 'bold');
    const newText1 = document.createTextNode(data.name.toString().concat(': '));
    newSpan.appendChild(newText1);
    newLi.appendChild(newSpan);
    const newText2 = document.createTextNode(data.message.toString());
    newLi.appendChild(newText2);
    document.getElementById("messages").appendChild(newLi);
});


//displays user join message
socket.on('user-connected', (msg) => {
    const newLi = document.createElement('li');
    newLi.setAttribute('class', 'italic');
    const newText = document.createTextNode(msg);
    newLi.appendChild(newText);
    document.getElementById("messages").appendChild(newLi);
})

//displays user disconnect message
socket.on('user-disconnected', (msg) => {
    const newLi = document.createElement('li');
    newLi.setAttribute('class', 'italic');
    const newText = document.createTextNode(msg);
    newLi.appendChild(newText);
    document.getElementById("messages").appendChild(newLi);
})

//user enters name
var name = prompt('Enter your name');
socket.emit('new-user', room, name);