#for file in *.webp; do convert $file -resize '12000000@>' $file; done
for file in BAKE*.jpg; do convert $file -resize '9000000@>' $file; done