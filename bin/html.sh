rm *.html

. ../meta.ini
THISGALLERY=s/{GALLERY}/${name}/
THISIZE=${count}
THISCOUNT=s/{SIZE}/${count}/

cp ../../../res/001.res 0180.0220.html
sed -i $THISGALLERY 0180.0220.html
sed -i 's/{NAME}/0180.0220/' 0180.0220.html
sed -i $THISCOUNT 0180.0220.html

cp ../../../res/001.res 0490.0280.html
sed -i $THISGALLERY 0490.0280.html
sed -i 's/{NAME}/0490.0280/' 0490.0280.html
sed -i $THISCOUNT 0490.0280.html

cp ../../../res/001.res 0420.0240.html
sed -i $THISGALLERY 0420.0240.html
sed -i 's/{NAME}/0420.0240/' 0420.0240.html
sed -i $THISCOUNT 0420.0240.html

cp ../../../res/001.res 0240.0240.html
sed -i $THISGALLERY 0240.0240.html
sed -i 's/{NAME}/0240.0240/' 0240.0240.html
sed -i $THISCOUNT 0240.0240.html

cp ../../../res/002.res 002.html
sed -i $THISGALLERY 002.html
sed -i $THISCOUNT 002.html 

cp ../../../res/003.res 003.html
sed -i $THISGALLERY 003.html
sed -i $THISCOUNT 003.html 

TITLELST="lst = ["
COUNT=`expr $THISIZE - 1`
for i in $(seq 0 $COUNT); do 
    PROJECT=$(printf "%04d" "$i") 
    . ../$PROJECT/meta.ini
    IMAGECOUNT=${count}
    TITLE="${title}"
    TITLELST=$TITLELST\"$TITLE\",
done
TITLELST=$TITLELST"];"

for i in $(seq 0 $COUNT); do 
    PROJECT=$(printf "%04d" "$i") 
    . ../$PROJECT/meta.ini
    IMAGECOUNT=${count}
    TITLE=${title}
    rm ../$PROJECT/*.html 2> /dev/null  
    cp ../../../res/000.res ../$PROJECT/000.html 2> /dev/null
    sed -i $THISGALLERY ../$PROJECT/000.html 2> /dev/null
    j="s/{PROJECT}/$PROJECT/"
    sed -i $j ../$PROJECT/000.html 2> /dev/null
    j="s/{IMAGECOUNT}/$IMAGECOUNT/"
    sed -i $j ../$PROJECT/000.html 2> /dev/null 
    j="s/{COUNT}/$THISIZE/"
    sed -i $j ../$PROJECT/000.html 2> /dev/null
    j="s/{TITLE}/$TITLE/"
    sed -i "$j" ../$PROJECT/000.html 2> /dev/null
    j="s/{TITLELST}/$TITLELST/"
    sed -i "$j" ../$PROJECT/000.html 2> /dev/null
done


