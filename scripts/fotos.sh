#!/bin/sh
# Prepara as fotos dos autores. Coloque o arquivo como src/assets/fotos/<id-do-autor>.jpg
# e rode `npm run fotos`: reduz a foto para no máx. 900px e gera a miniatura (200px) em mini/.
# ponytail: usa o `sips` do macOS; em Linux/Windows, trocar por ImageMagick ou sharp.
set -e
cd "$(dirname "$0")/../src/assets/fotos"
mkdir -p mini
for f in *.jpg; do
  largura=$(sips -g pixelWidth "$f" | awk '/pixelWidth/ {print $2}')
  altura=$(sips -g pixelHeight "$f" | awk '/pixelHeight/ {print $2}')
  if [ "$largura" -gt 900 ] || [ "$altura" -gt 900 ]; then
    sips -Z 900 -s formatOptions 82 "$f" >/dev/null
  fi
  [ -f "mini/$f" ] || sips -Z 200 -s formatOptions 75 "$f" --out "mini/$f" >/dev/null
done
echo "Fotos prontas: $(ls *.jpg | wc -l | tr -d ' ')"
