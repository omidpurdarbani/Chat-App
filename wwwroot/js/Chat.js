var chatterName = "Visitor";


var dialogEL = document.getElementById('chatDialog');

//Initialize SignalR
var connection = new signalR.HubConnectionBuilder()
    .withUrl('/chatHub')
    .build();

connection.on('ReceiveMessage', renderMessage);

connection.onclose(function() {
    onDisconnected();
    console.log('ReConnecting in 5 Second ...');
    setTimeout(startConnection, 5000);
});

function startConnection() {
    connection.start().then(onConnected).catch(function(err) {
        console.log(err);
    });
}

function onDisconnected() {
    dialogEL.classList.add('disconnected');
}

function onConnected() {
    dialogEL.classList.remove('disconnected');

    var messageTextBox = document.getElementById('messageTextBox');
    messageTextBox.focus();

    connection.invoke('SetName', chatterName);

}

function ready() {
    var chatForm = document.getElementById('chatForm');
    chatForm.addEventListener('submit',
        function(e) {
            e.preventDefault();
            var text = e.target[0].value;
            e.target[0].value = '';
            sendMessage(text);
        });

    var welcomePanelFormEL = document.getElementById('chatWelcomePanel');
    welcomePanelFormEL.addEventListener('submit', function(e) {
        e.preventDefault();

        var name = e.target[0].value;
        if (name && name.length) {
            welcomePanelFormEL.style.display = 'none';
            chatterName = name;
            startConnection();
        }
    });

}

function sendMessage(text) {
    if (text && text.length) {
        connection.invoke('SendMessage', chatterName, text);
    }
}

function renderMessage(name,time,message) {
    var nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = name;

    var timeSpan = document.createElement('span');
    timeSpan.className = 'time';
    var timeFriendly = moment(time).format('H:mm');
    timeSpan.textContent = timeFriendly;

    var headerDiv = document.createElement('div');
    headerDiv.appendChild(nameSpan);
    headerDiv.appendChild(timeSpan);

    var messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;

    var newItem = document.createElement('li');
    newItem.appendChild(headerDiv);
    newItem.appendChild(messageDiv);

    var chatHistory = document.getElementById('chatHistory');
    chatHistory.appendChild(newItem);
    chatHistory.scrollTop = chatHistory.scrollHeight - chatHistory.clientHeight;
}


document.addEventListener('DOMContentLoaded',ready);