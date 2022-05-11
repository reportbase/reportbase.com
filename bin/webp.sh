for i in BUGS*.jpg; do convert $i -quality 80 ${i/.jpg/.webp} done


