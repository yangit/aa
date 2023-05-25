# OPENAI_API_KEY=$(cat ~/Dropbox/.openAiKey ) AVPATH=~/Downloads/aa/rec/rec2.mp3 ./av.sh

curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@$AVPATH" \
  -F model="whisper-1"| jq -r '.text'