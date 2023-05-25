# Chat with GPT-3

This is a Node.js program that allows for conversational interactions with OpenAI's GPT-3 API. It takes user input from the command line or standard input stream and sends it as input to the GPT-3 API. The API generates a response based on the input and sends it back to the program, which then prints the response to the console.

The program also has the ability to save the conversation history to a JSON file for future reference. It uses the `os` and `path` modules to create a path to a hidden `.aaDb.json` file in the user's home directory, where it saves the conversation history.

## Usage

To use this program, you must have an OpenAI API key saved in a file named `openAiKey` in the same directory as the `chat.js` file. Alternatively, you can specify the file location of your API key in the `readFileSync()` function in the `catch` block of the `try/catch` statement.

To start the program, run the following command in your terminal:

```
node chat.js [options] <prompt>
```

Where `[options]` can be:

- `--session <n>`: Specify a session number to load from the database file. Default value is the next available index after the last valid session in the file. To load the most recent session, use the value `last`.

And `<prompt>` is the prompt for the first message of the conversation.

Example usage:

```
node chat.js --session 2 "Hello, how are you?"
How are you doing today?
```

## Dependencies

This program uses the following Node.js modules:

- `https`
- `fs`
- `os`
- `path`
