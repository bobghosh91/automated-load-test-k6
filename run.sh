docker run -i --rm -v .:/scripts -w /scripts grafana/k6:0.51.0-with-browser run /scripts/script.js

# * docker run: Runs a Docker container.
# * -i: Keeps STDIN open even if not attached.
# * --rm: Automatically removes the container when it exits.
# * -v $(pwd):/scripts: Mounts the current directory ($(pwd)) to the /scripts directory in the container.
# * -w /scripts: Sets the working directory inside the container to /scripts.
# * grafana/k6: Specifies the k6 Docker image.
# * run /scripts/script.js: Runs the script.js file located in the /scripts directory inside the container.