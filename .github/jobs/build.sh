#!/usr/bin/env bash

mkdir -p "${GH_PAGES_ARTIFACTS_DIR}"

for app in apps/*; do
    if [ "$app" != "apps/index" ] && [ -d "$app/dist" ]; then
        echo "Moving $app/dist"
        appname=$(basename "$app")
        mv "$app/dist" "${GH_PAGES_ARTIFACTS_DIR}/${appname}"
    fi

    if [ "$app" = "apps/index" ] && [ -d "$app/dist" ]; then
        echo "Creating index page from $app/dist"
        mv $app/dist/* "${GH_PAGES_ARTIFACTS_DIR}"
    fi
done
