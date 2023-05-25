#!/bin/bash
KEY=$(cat ~/Dropbox/.openAiKey)
# NODE_PATH=$HOME/Dropbox/github/aa/node-v18.16.0-darwin-x64/bin/node
NODE_PATH=node
JS_PATH=~/Dropbox/github/aa/js/aa.js

if [ -t 0 ]; then
  # If stdin is not available, just run the command without piping any input to it
  OPENAI_API_KEY=$KEY $NODE_PATH $JS_PATH "$@"
else
  # If stdin is available, pipe it to the command
  cat - | OPENAI_API_KEY=$KEY $NODE_PATH $JS_PATH "$@"
fi
