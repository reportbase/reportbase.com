mkdir tmp
export MAGICK_TMPDIR=tmp
convert {0000..0006}.webp +append WELL.0000.webp
convert {0007..0013}.webp +append WELL.0001.webp
convert {0014..0020}.webp +append WELL.0002.webp
convert {0021..0027}.webp +append WELL.0003.webp
convert {0028..0034}.webp +append WELL.0004.webp
convert {0035..0041}.webp +append WELL.0005.webp
convert {0042..0048}.webp +append WELL.0006.webp
convert {0042..0048}.webp +append WELL.0007.webp
#convert {0030..0035}.webp +append PIPE.0005.webp
#convert {0036..0041}.webp +append GRRW.0006.webp
#convert {0042..0047}.webp +append GRRW.0007.webp
#convert {0048..0053}.webp +append SUID.0008.webp
#convert {0054..0059}.webp +append SUID.0009.webp
#convert {0060..0065}.webp +append SUID.0010.webp
#convert {0066..0071}.webp +append SUID.0011.webp
#convert {0072..0077}.webp +append SUID.0012.webp
#convert {0078..0083}.webp +append SUID.0013.webp
#convert {0084..0089}.webp +append SUID.0014.webp
#convert {0090..0095}.webp +append SUID.0015.webp
#convert {0096..0101}.webp +append SUID.0016.webp
#convert {0102..0107}.webp +append SUID.0017.webp
#convert {0108..0113}.webp +append SUID.0018.webp
#convert {0114..0119}.webp +append SUID.0019.webp
#convert {0120..0125}.webp +append SUID.0020.webp
#convert {0126..0131}.webp +append SUID.0021.webp


#for image in GRRW*.webp; do convert $image -quality 80 $image; done

