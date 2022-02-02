# sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
# sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

export DISPLAY=:0
chromium http://localhost:8090\
    --kiosk\ 
    --incognito\
    --noerrdialogs\
    --disable-translate\
    --no-first-run\
    --fast\
    --fast-start\
    --disable-infobars\
    --disable-features=TranslateUI\
    --password-store=basic
    # --disk-cache-dir=/dev/null\