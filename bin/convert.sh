#for file in *.webp; do convert $file -resize '12000000@>' $file; done
for file in GOLF*.webp; do convert $file -resize '6000000@>' $file; done
