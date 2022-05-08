../bin/./rename16.sh
../bin/./rename4.sh
#resize.sh x2160

mkdir TMP
export MAGICK_TMPDIR=TMP
#magick -size 1405x2160 xc:white 0023.jpg
convert {0000..0004}.jpg +append MEAD.0000.jpg
convert {0000..0004}.jpg -append MEAD.0001.jpg
