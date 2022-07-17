mkdir tmp
export MAGICK_TMPDIR=tmp
convert {0000..0005}.jpg +append PIPE.0015.jpg
convert {0006..0011}.jpg +append PIPE.0016.jpg
convert {0012..0017}.jpg +append PIPE.0017.jpg
convert {0018..0023}.jpg +append PIPE.0018.jpg
convert {0024..0029}.jpg +append PIPE.0019.jpg
#convert {0030..0035}.jpg +append PIPE.0005.jpg
#convert {0036..0041}.jpg +append GRRW.0006.jpg
#convert {0042..0047}.jpg +append GRRW.0007.jpg
#convert {0048..0053}.jpg +append SUID.0008.jpg
#convert {0054..0059}.jpg +append SUID.0009.jpg
#convert {0060..0065}.jpg +append SUID.0010.jpg
#convert {0066..0071}.jpg +append SUID.0011.jpg
#convert {0072..0077}.jpg +append SUID.0012.jpg
#convert {0078..0083}.jpg +append SUID.0013.jpg
#convert {0084..0089}.jpg +append SUID.0014.jpg
#convert {0090..0095}.jpg +append SUID.0015.jpg
#convert {0096..0101}.jpg +append SUID.0016.jpg
#convert {0102..0107}.jpg +append SUID.0017.jpg
#convert {0108..0113}.jpg +append SUID.0018.jpg
#convert {0114..0119}.jpg +append SUID.0019.jpg
#convert {0120..0125}.jpg +append SUID.0020.jpg
#convert {0126..0131}.jpg +append SUID.0021.jpg


#for image in GRRW*.jpg; do convert $image -quality 80 $image; done

