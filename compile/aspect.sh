identify *.webp | gawk '{split($3,sizes,"x"); print $1,sizes[1],sizes[2],sizes[1]*sizes[2],sizes[1]/sizes[2]}' | sed 's/\[.\]//' | sort -gk 5




