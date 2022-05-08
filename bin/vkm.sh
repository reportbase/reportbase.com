#12,24,36,48,60,72,84,96
#2,3,4,6,12

#36,72,108,144,180
#2,3,4,6,9,12,18,36

#montage orig/*.jpg -tile 1x1 -mode Concatenate 001.0%02d.jpg 
montage orig/*.jpg -tile 2x1 -mode Concatenate 002.0%02d.jpg 
montage orig/*.jpg -tile 3x1 -mode Concatenate 003.0%02d.jpg 
montage orig/*.jpg -tile 4x1 -mode Concatenate 004.0%02d.jpg
montage orig/*.jpg -tile 6x1 -mode Concatenate 006.0%02d.jpg
#montage orig/*.jpg -tile 9x1 -mode Concatenate 009.0%02d.jpg 
#montage orig/*.jpg -tile 12x1 -mode Concatenate 012.0%02d.jpg 
#montage orig/*.jpg -tile 18x1 -mode Concatenate 018.0%02d.jpg 
#montage orig/*.jpg -tile 36x1 -mode Concatenate 036.0%02d.jpg 

