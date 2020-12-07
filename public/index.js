async function joinChatroom(nameIn) {
        //store the room name
    let data = 
    {
        "name" : nameIn
    };
        //uploads as JSON data
    const res = await fetch('/api/room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    //redirect user to chatroom
    window.location.href = '/chat/'.concat(nameIn);
}

