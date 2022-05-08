if [ ! -f "splash.jpg" ]; then
    rm thumb.jpg 2> /dev/null
    rm splash.jpg 2> /dev/null
    convert 002.000.jpg +append splash.jpg
    convert splash.jpg  -auto-orient -thumbnail x1080  -unsharp 0x.5 splash.jpg 
    #convert splash.jpg -gravity center -crop 1260x360+0+0 splash.jpg
fi


