#rename 4000
a=$1
#for i in *.JPG ; do
#for i in *.jpg ; do
for i in *.JPG *.jpg ; do
  new=$(printf "%016d.jpg" "$a") #08 pad to length of 8
  mv -- "$i" "$new" 2> tmp
  let a=a+1
done



