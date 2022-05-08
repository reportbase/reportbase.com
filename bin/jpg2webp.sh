for i in DEAD*.jpg; do
     convert $i ${i/.jpg/.webp}
done

