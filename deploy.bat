cd dist
copy index.html 404.html || cp index.html 404.html
RMDIR assets\mojLawSplitJSON /S /Q
git init
git add -A
git commit -m "auto"
git push -u https://github.com/kong0107/mojLaw.git HEAD:gh-pages --force
cd ..
