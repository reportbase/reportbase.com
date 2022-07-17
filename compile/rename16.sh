#rename 4000
a=$1
for i in *.JPG *.jpg ; do
  new=$(printf "%016d.jpg" "$a") 
  mv -- "$i" "$new" 
  let a=a+1
done



