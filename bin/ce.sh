convert -background black -bordercolor black -fill white \
   -size 400x800 -font $2 -gravity center caption:@-     \
   -trim -channel A -fx '(lightness/2)+.5'    \
   -gravity center $1.jpg +swap -composite $1.jpg


