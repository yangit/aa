#!/bin/bash
set -ex
ELEVEN_API=$(cat ~/Dropbox/.elevenApi)
OPENAI_API_KEY=$(cat ~/Dropbox/.openAiKey)
AVPATH=$HOME/Dropbox/github/aa
RECPATH=$AVPATH/rec/rec.mp3
PIC_REC_PATH=$AVPATH/rec/recording
PIC_PROCESS_PATH=$AVPATH/rec/processing

if [ ! -e "$PIC_PROCESS_PATH" ]; then
    if [ ! -e "$PIC_REC_PATH" ]; then
        touch $PIC_REC_PATH
        afplay $AVPATH/sounds/chimes.mp3 &
        open -g  $AVPATH/assets/start.ahcommand
    else
        touch $PIC_PROCESS_PATH
        rm $PIC_REC_PATH    
        afplay $AVPATH/sounds/click2.wav &
        open -g $AVPATH/assets/stop.ahcommand

        while [[ ! -e $RECPATH ]]
        do
        sleep 0.1
        echo "waiting for $RECPATH"
        done

        TEXT=$(curl https://api.openai.com/v1/audio/transcriptions -s \
        -H "Authorization: Bearer $OPENAI_API_KEY" \
        -H "Content-Type: multipart/form-data" \
        -F file="@$RECPATH" \
        -F model="whisper-1"| /usr/local/bin/jq -r '.text')
        echo $TEXT
        echo -n $TEXT > $AVPATH/rec/rec.txt
        echo -n $TEXT | OPENAI_API_KEY=$OPENAI_API_KEY /usr/local/bin/node $AVPATH/js/director.js  > $AVPATH/log.txt 2>&1
        rm $RECPATH.old || true
        mv $RECPATH $RECPATH.old
        rm $PIC_PROCESS_PATH
    fi
else 
    afplay $AVPATH/sounds/err.wav &
fi

