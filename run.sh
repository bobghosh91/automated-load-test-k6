#using bash
# K6_BROWSER_HEADLESS=false BASE_URL='https://reqres.in/api' k6 run http_req.js

# docker run -i --rm -v .:/scripts -w /scripts grafana/k6:0.51.0-with-browser run /scripts/script.js

# * docker run: Runs a Docker container.
# * -i: Keeps STDIN open even if not attached.
# * --rm: Automatically removes the container when it exits.
# * -v $(pwd):/scripts: Mounts the current directory ($(pwd)) to the /scripts directory in the container.
# * -w /scripts: Sets the working directory inside the container to /scripts.
# * grafana/k6: Specifies the k6 Docker image.
# * run /scripts/script.js: Runs the script.js file located in the /scripts directory inside the container.

# using k6 browser
docker run -i --rm -v $(PWD):/scripts -w /scripts -e K6_BROWSER_HEADLESS=true -e BASE_URL='https://www.phactmi.org' grafana/k6:0.51.0-with-browser run --http-debug=full - <script_browser.js