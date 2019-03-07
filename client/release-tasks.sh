npm run build &

cd build/static/js

find . -name "*.js.map" -type f -delete &

cd ..
cd ..
cd styles/

rm -r scss
rm main.css
