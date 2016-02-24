var file;
var Users;

// Load json file
// TODO backup json in exports.unload()
exports.load = function () {
    try {
        file = JSON.parse(require.safe('./../common/todoList.json'));
        
        // If file is empty for some weird reason
        if (!file.hasOwnProperty("users")) {
            // Init JSON
            // TODO Init without a useless boilerplate
            file.users = [
                {
                    "id": 0,
                    "name": "Kassy",
                    "list": [
                        { "item": "Hello World" }
                    ]
                }
            ]
        }
        // Continue as usual, load users
        Users = file.users;
    }
    catch (e) {
        // If JSON does not exist, notify user
        file = null;
    }
}

exports.match = function (text, commandPrefix) {
    return text.startsWith(commandPrefix + 'todo' ||
        text === commandPrefix + 'todo ' + commandPrefix + 'add' ||
        text === commandPrefix + 'todo ' + commandPrefix + 'remove');
};

exports.help = function () {
    return [[this.commandPrefix + 'todo', 'Displays list of todo items'],
        [this.commandPrefix + 'todo ' + this.commandPrefix + 'add <text>', 'Adds a new todo list item for the current user'],
        [this.commandPrefix + 'todo ' + this.commandPrefix + 'removes <item number>', 'Removes todo list item for the current user']];
};

exports.run = function (api, event) {
    // Scan for the JSON file
    var command = event.body;
    var commandPrefix = api.commandPrefix;
    var query;

    if (new File(file !== null)) {
        var userName = event.sender_name;
        var userId = event.sender_id;

        if (command.startsWith(commandPrefix + "todo " + commandPrefix + "add")) {
            query = command.replace(commandPrefix + "todo " + commandPrefix + "add", "");
            AddTodoItem(userName, userId, query.trim());

        } else if (command.startsWith(commandPrefix + "todo " + commandPrefix + "remove")) {
            query = command.replace(commandPrefix + "todo " + commandPrefix + "add", "");
            RemoveTodoItem(userName, userId, query.trim());
            
        } else if(command.startsWith(commandPrefix + "todo")){
            query = command.replace(commandPrefix + "todo", "");
            DisplayTodo(userName, userId);
        }
    } else {
        // JSON file not found, display appropriate message
        api.sendMessage("SOMEONE STOLE ALL YOUR SECRETS! RUN AND HIDE!!!!!", event.thread_id);
    }
};

function AddTodoItem(userName, userId, text) {
    // Search user with name and id, if exists, add item to JSON
    // else create a new user and add item
}

function RemoveTodoItem(userName, userId, itemId) {
    // Search user with name and id, if exists remove item , id defines array index
    // else display sarcastic message
}

function DisplayTodo(userName, userId){
    // Search user with name and id, if exists
    // Display all todo items of the requesting user ONLY
    // else Display that no items in the list yet (be polite)
}