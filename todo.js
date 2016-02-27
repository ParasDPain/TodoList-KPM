var fs = require.safe('fs-extra')

var file;
var Users;

// Load json file
// TODO backup json in exports.unload()
exports.load = function () {

    var file = require.safe('./../common/todoList.json');
    fs.ensureFile(file, function (err) {
        console.log(err) // => null 
        // file has now been created, including the directory it is to be placed in 
    });

    if (file.users == null) {
        file.users = [];
    }
    Users = file.users;

/*    try {
        file = require.safe('./../common/todoList.json');
        
        // If file is empty for some weird reason
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
        // Continue as usual, load users
        Users = file.users;
    }
    catch (e) {
        if (e.code === "ENOENT") {
            // Error NO ENTry
            // File not found thrown, create a new file
            var fileOut = new File({ "users": [] }, "./../common/todoList.json");
        } else {
            file = null;
            throw e;
        }
    } */
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

    if (file !== null) {
        var userName = event.sender_name;
        var userId = event.sender_id;

        if (command.startsWith(commandPrefix + "todo " + commandPrefix + "add")) {
            query = command.replace(commandPrefix + "todo " + commandPrefix + "add", "");
            api.SendMessage(AddTodoItem(userName, userId, query.trim()), event.thread_id);

        } else if (command.startsWith(commandPrefix + "todo " + commandPrefix + "remove")) {
            query = command.replace(commandPrefix + "todo " + commandPrefix + "add", "");
            api.SendMessage(RemoveTodoItem(userName, userId, query.trim()), event.thread_id);

        } else if (command.startsWith(commandPrefix + "todo")) {
            query = command.replace(commandPrefix + "todo", "");
            api.SendMessage(DisplayTodo(userName, userId), event.thread_id);
        }
    } else {
        // JSON file couldn't be loaded for unknown reasons
        api.sendMessage("SOMEONE STOLE ALL YOUR SECRETS! RUN AND HIDE!!!!!", event.thread_id);
    }
};

function AddTodoItem(userName, userId, text) {
    // Search user with name and id, if exists, add item to JSON
    // else create a new user and add item
    var u = SearchUserById(userId);
    if (u !== null) {
        if (text.length > 0) {
            // All good here
            u.list.push({ "item": text });
            return "(Y)";
        } else {
            // User exists but sends empty text
            return "An empty item is no item. Nothing added!";
        }
    } else {
        // User does not exist, create a new one
        Users.push(
            {
                "id": userId,
                "name": userName,
                "list": [
                    { "item": text }
                ]
            });
        return "(Y) Created a new todo list for you. ";
    }

    UpdateTodoJson();
}

function RemoveTodoItem(userName, userId, itemId) {
    // Search user with name and id, if exists remove item , id defines array index
    // else display sarcastic message
    var u = SearchUserById(userId);
    itemId--; // To handle a zero-based system
    if (u !== null) {
        if (u.list[itemId].item !== null) {
            // All good here
            u.list.splice(itemId, 1); // remove 1 entry starting at itemId
            return "removed todo item";
        } else {
            // User exists but invalid itemId
            return "Wrong item ID, please try again.";
        }
    } else {
        // User does not exist, create a new one
        return "Ain't got no todo-s for ya mate ._. You must be new here! ";
    }

    UpdateTodoJson();
}

// Display all todo items of the requesting user ONLY
function DisplayTodo(userName, userId) {
    var u = SearchUserById(userId);
    if (u !== null) {
        var message = "Todo List for " + u + "\n";
        for (var i = 0; i < u.list.length; i++) {
            message += i + 1 + "\t" + u.list[i].item + "\n";
        }
        return message;
    } else {
        // else Display that no items in the list yet (be polite)
        return "You don't have any items in your list yet";
    }
}

// Search user by Id in the local json records
function SearchUserById(userId) {
    for (var i = 0; i < Users.length; i++) {
        if (Users[i].id === userId) {
            return Users[i];
        }
    }
    return null;
}

function UpdateTodoJson() {
    file = Users;
}