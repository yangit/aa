# Chat with GPT-3

## Install

```bash
npm i
npm run build
npm start
```

This is a Node.js program that allows for conversational interactions with OpenAI's GPT-4 API. It takes user input from the command line or standard input stream and sends it as input to the GPT-4 API. The API generates a response based on the input and sends it back to the program, which then prints the response to the console.

The program also has the ability to save the conversation history to a JSON file for future reference. It uses a hidden `~/.aaState.json` file in the user's home directory, where it saves the conversation history.

## Usage

To use this program, you must have an supply `OPENAI_API_KEY=` environmental variable when you start the script. Refer to `package.json`
