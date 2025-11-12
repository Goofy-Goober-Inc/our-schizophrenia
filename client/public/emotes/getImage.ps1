param(
  [string]$imageUrl = 'url',
  [string]$imageName = 'rename'
)

Invoke-WebRequest -o $imageName $imageUrl
ffmpeg -i $imageName -c:v libwebp -lossless 1 .\$imageName.webp
Remove-Item $imageName