#convert -size 120x120 pattern:checkerboard -auto-level checker_black_white.gif
#image.sh 1000x1000 a.jpg
#convert -size $1 canvas:white $2
#http://www.imagemagick.org/script/formats.php

convert -size $1 pattern:CROSSHATCH45 -auto-level $2


