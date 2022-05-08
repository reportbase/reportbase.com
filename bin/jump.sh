for i in $(seq 0 71); 
do 
    B=$(printf "%03d" "$i") 
    printf "ln -s ../0014/001.%s.jpg\n" $B $B; 
done

for i in $(seq 0 35); 
do 
    B=$(printf "%03d" "$i") 
    printf "ln -s ../0014/002.%s.jpg 002.%s.jpg\n" $B $B; 
done

for i in $(seq 0 23); 
do 
    B=$(printf "%03d" "$i") 
    printf "ln -s ../0014/003.%s.jpg 003.%s.jpg\n" $B $B; 
done

for i in $(seq 0 17); 
do 
    B=$(printf "%03d" "$i") 
    printf "ln -s ../0014/004.%s.jpg 004.%s.jpg\n" $B $B; 
done

for i in $(seq 0 11); 
do 
    B=$(printf "%03d" "$i") 
    printf "ln -s ../0014/006.%s.jpg 006.%s.jpg\n" $B $B; 
done

ln -s 001.000.jpg splash.jpg
