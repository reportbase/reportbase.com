#../bin/./rename16.sh
#../bin/./rename4.sh
#resize.sh x2160

mkdir TMP
export MAGICK_TMPDIR=TMP
convert {0000..0005}.jpg +append DEAD.0011.jpg
convert {0006..0011}.jpg +append DEAD.0012.jpg
convert {0012..0017}.jpg +append DEAD.0013.jpg
convert {0018..0023}.jpg +append DEAD.0014.jpg
convert {0024..0029}.jpg +append DEAD.0015.jpg
convert {0030..0035}.jpg +append DEAD.0016.jpg
convert {0036..0041}.jpg +append DEAD.0017.jpg
convert {0042..0047}.jpg +append DEAD.0018.jpg
convert {0048..0053}.jpg +append DEAD.0019.jpg
convert {0054..0059}.jpg +append DEAD.0020.jpg
convert {0060..0065}.jpg +append DEAD.0021.jpg
convert {0066..0071}.jpg +append DEAD.0022.jpg
convert {0072..0077}.jpg +append DEAD.0023.jpg
convert {0078..0083}.jpg +append DEAD.0024.jpg
convert {0084..0089}.jpg +append DEAD.0025.jpg
convert {0090..0095}.jpg +append DEAD.0026.jpg
