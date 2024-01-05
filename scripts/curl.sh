RESPONSE=$(curl -s -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(cat ~/Dropbox/keys/.openAiKey)" \
  -d "{
    \"model\": \"gpt-4\",
    \"messages\": [{\"role\": \"user\", \"content\": \"$1\"}]
      }")

if echo $RESPONSE | jq -r '.choices[0].message.content' >/dev/null; then
  echo $RESPONSE | jq -r '.choices[0].message.content'
else
  echo $RESPONSE
fi
