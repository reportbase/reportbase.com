../bin/./rename16.sh
../bin/./rename4.sh
#resize.sh x2160

export MAGICK_TMPDIR=TMP
mkdir TMP
convert *{0000..0005}.jpg +append DEAD.0000.jpg
convert *{0006..0011}.jpg +append DEAD.0001.jpg
convert *{0012..0017}.jpg +append DEAD.0002.jpg
convert *{0018..0023}.jpg +append DEAD.0003.jpg
convert *{0024..0029}.jpg +append DEAD.0004.jpg
convert *{0030..0035}.jpg +append DEAD.0005.jpg
convert *{0036..0041}.jpg +append DEAD.0006.jpg
convert *{0042..0047}.jpg +append DEAD.0007.jpg
convert *{0048..0053}.jpg +append DEAD.0008.jpg
convert *{0054..0059}.jpg +append DEAD.0009.jpg
convert *{0060..0065}.jpg +append DEAD.0010.jpg
convert *{0066..0071}.jpg +append DEAD.0011.jpg
convert *{0072..0077}.jpg +append DEAD.0012.jpg
convert *{0078..0083}.jpg +append DEAD.0013.jpg
convert *{0084..0089}.jpg +append DEAD.0014.jpg
convert *{0090..0095}.jpg +append DEAD.0015.jpg
