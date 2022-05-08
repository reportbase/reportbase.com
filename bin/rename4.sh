#rename 4000
a=$1
#for i in *.JPEG *.jpg *.JPG *.jpeg; do
for i in *.jpg; do
  new=$(printf "%04d.jpg" "$a") 
  mv -- "$i" "$new" 2> error
  let a=a+1
done



