// // Import required modules
// const https = require('https');
// const fs = require('fs');
// const [, , ...args] = process.argv;
// const os = require('os');
// const path = require('path');
// const EventSource = require('./eventsource');
// const readStdin = require('./readStdin.js');
// const { log } = require('console');

// // Main function
// const main = async () => {
//   // Set path to database file
//   const dbPath = path.join(os.homedir(), '.aaDb.json');

//   // Initialize database array
//   let db = [];

//   // Check if database file exists and read its content into the database array
//   if (fs.existsSync(dbPath)) {
//     db = JSON.parse(fs.readFileSync(dbPath, 'utf8').toString());
//   } else { // Create the database file if it doesn't exist
//     fs.writeFileSync(dbPath, JSON.stringify(db, null, '\t'));
//   }

//   // Initialize flags object with default session index
//   const flags = {
//     session: db.length,
//     model: 'gpt-3.5-turbo',
//   };

//   let argMessage = '';
//   // Parse command-line arguments to detect session flag and its value
//   args.forEach((arg, index) => {
//     if (!arg.startsWith('-') && args.indexOf(arg) === args.length - 1) {
//       argMessage = arg;
//     }
//     if (arg === '-3') {
//       flags.model = 'gpt-3.5-turbo';
//     }
//     if (arg === '-4') {
//       flags.model = 'gpt-4';
//     }
//     if (arg === '--session' || arg === '-l') {
//       const session = args[index + 1];
//       if (session === 'last' || arg === '-l') { // Set session flag to index of last session in database
//         flags.session = db.length - 1;
//       } else { // Set session flag to passed integer value
//         flags.session = args[index + 1];
//       }
//     }
//     if (arg === '-q') {
//       console.log(db.map(({ data, flags: { session } }) => `${session} : ${data.messages[0].content.split('\n')[0]}`).join('\n'));
//       process.exit(0);
//     }
//     if (arg === '-d') {
//       fs.writeFileSync(dbPath, JSON.stringify([], null, '\t'));
//       process.exit(0);
//     }
//   });
//   console.log(flags.model);

//   // Define function to read input from standard input stream

//   // Initialize data object with model name and messages array
//   const data = {
//     model: flags.model,
//     messages: [],
//     stream: true,
//   };

//   // Get the current session data from the database if it exists
//   const entry = db[flags.session];

//   // If session data exists, add its messages and response choices to the data object
//   if (entry) {
//     entry.data.messages.forEach((message) => {
//       data.messages.push(message);
//     });
//     entry.response.choices.forEach((choice) => {
//       // choice.message.content = choice.message.content.replace(/\n/g, ' ');
//       data.messages.push(choice.message);
//     });
//   }

//   // Add the final argument passed on the command line as a user message to the data object

//   if (argMessage.length) {
//     data.messages.push({ role: 'user', content: argMessage });
//   }

//   // Read input data from standard input stream into inputData variable
//   let inputData = '';
//   if (!process.stdin.isTTY) {
//     inputData = await readStdin();
//   }

//   // If inputData has a length, add it as a user message to the data object
//   if (inputData.length) {
//     data.messages.push({ role: 'user', content: inputData });
//   }

//   // Convert data object to JSON format
//   const dataJson = JSON.stringify(data);

//   // Read OpenAI API key from file and set authorization header for API request
//   const token = process.env.OPENAI_API_KEY;

//   // Set options for HTTPS request to OpenAI API
//   const options = {
//     hostname: 'api.openai.com',
//     port: 443,
//     path: '/v1/chat/completions',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': dataJson.length,
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   let response = '';
//   const es = new EventSource(options, dataJson);
//   const listener = (event) => {
//     JSON.parse(event.data).choices.forEach((choice) => {
//       if (choice.finish_reason === 'stop') {
//         es.removeEventListener('message', listener);
//         db[flags.session] = { flags, data, response: { choices: [{ message: { role: 'assistant', content: response } }] } };
//         fs.writeFileSync(dbPath, JSON.stringify(db, null, '\t'));
//       }
//       if (choice.index !== 0) {
//         console.log(JSON.stringify(choice));
//         throw new Error('chouce.index is not 0');
//       }
//       if (!choice.delta.content && !choice.delta.role === 'assistant') {
//         console.log(JSON.stringify(choice));
//         throw new Error('No content in choice');
//       }
//       if (choice.delta.content) {
//         response += choice.delta.content;
//         process.stdout.write(choice.delta.content);
//       }
//     });
//   };
//   es.addEventListener('message', listener);
//   es.addEventListener('error', (event) => {
//     console.log(options);
//     console.log(JSON.stringify(data, null, '\t'));
//     console.log('ERRRRORR:', event);
//     process.exit(1);
//   });

//   // var source = new SSE('https://api.openai.com/v1/chat/completions', {
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     Authorization: `Bearer ${token}`
//   //   },
//   //   payload: dataJson
//   // });

//   // source.addEventListener('message', function(e) {
//   //   console.log('D-ATA-:',e.data);
//   // });

//   // source.addEventListener('status', function(e) {
//   //   console.log('System status is now: ' + e.data);
//   // });

//   // source.stream();

//   // // Send HTTPS request to OpenAI API
//   // const req = https.request(options, (res) => {
//   //   res.setEncoding('utf8');
//   //   let responseData = '';

//   //   // Accumulate response data as it is received
//   //   res.on('data', (chunk) => {
//   //     responseData += chunk;
//   //   });

//   //   // Process the response data when the response is complete
//   //   res.on('end', () => {
//   //     const response = JSON.parse(responseData);
//   //     if (response.choices) {
//   //       // Print each response message to the console
//   //       response.choices.forEach((choice) => {
//   //         console.log(choice.message.content);
//   //       });
//   //       // Update the database with the current session data
//   //       db[flags.session] = { flags, data, response };
//   //       fs.writeFileSync(dbPath, JSON.stringify(db, null, '\t'));
//   //     } else {
//   //       // If the response is incomplete or malformed, print the entire response object to the console
//   //       console.log(options);
//   //       console.log(JSON.stringify(data, null, '\t'));

//   //       console.log(response);
//   //     }
//   //   });
//   // });

//   // // Handle any errors with the HTTPS request
//   // req.on('error', (error) => {
//   //   console.error(`Error: ${error.message}`);
//   // });

//   // // Write the data object to the request body and end the HTTPS request
//   // req.write(dataJson);
//   // req.end();
// };

// // Call the main function to start the program
// main();
