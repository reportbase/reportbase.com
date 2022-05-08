#rename 4000
a=$1
for i in 0*; do
  new=$(printf "%04d" "$a") #08 pad to length of 8
  mv -- "$i" "$new" 2> error
  let a=a+1
done



