# #!/bin/bash
# ELEVEN_API=$(cat ~/Dropbox/.elevenApi)
# OPENAI_API_KEY=$(cat ~/Dropbox/.openAiKey)
# AVPATH=/Users/y/Dropbox/github/aa


# TEXT=$(curl https://api.openai.com/v1/audio/transcriptions \
#   -H "Authorization: Bearer $OPENAI_API_KEY" \
#   -H "Content-Type: multipart/form-data" \
#   -F file="@$AVPATH/rec/rec.mp3" \
#   -F model="whisper-1"| jq -r '.text')
# echo -n $TEXT > $AVPATH/rec/rec.txt
# afplay $AVPATH/sounds/click.wav &
# pbcopy < $AVPATH/rec/rec.txt 
# rm $AVPATH/rec/rec.mp3

# ffmpeg -f avfoundation -i ":0" -acodec libmp3lame -y rec.mp3
# curl https://api.openai.com/v1/audio/transcriptions -s \
#   -H "Authorization: Bearer $OPENAI_API_KEY" \
#   -H "Content-Type: multipart/form-data" \
#   -F file="@$AVPATH/rec/rec.mp3" \
#   -F model="whisper-1"| jq -r '.text' > $AVPATH/rec/rec.txt

# afplay $AVPATH/rec/rec.mp3

# cat rec.txt
# OPENAI_API_KEY=$OPENAI_API_KEY node ~/Dropbox/github/aa/ai-assistant.js "" < rec.txt > out.txt
# cat out.txt
# TEXT=$(cat out.txt)

# curl -X 'POST' 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL' \
#      --header 'accept: audio/mpeg' --silent \
#      --header "xi-api-key: $ELEVEN_API" \
#      --header 'Content-Type: application/json' \
#      --data "{
#        \"text\": \"$TEXT\",
#        \"voice_settings\": {
#          \"stability\": 0,
#          \"similarity_boost\": 0
#        }
#      }" --output out.mpeg

# afplay out.mpeg


