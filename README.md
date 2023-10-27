# Start

alias node='docker run -it --rm -v $(pwd):/app -w /app node:20-bookworm'
alias npm='docker run -it --rm -v $(pwd):/app -w /app --entrypoint npm node:20-bookworm'
alias npx='docker run -it --rm -v $(pwd):/app -w /app -p 80:80 --entrypoint npx node:20-bookworm'

npx vite --port 80 --host