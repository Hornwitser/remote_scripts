#!/bin/bash
set -e
VERSION=$1

if [[ $VERSION == "" ]]; then
    echo "Usage: dl-headless.sh <version>"
    echo "Download and extract given Factorio headless server"
    exit 1
fi

if [[ ! $VERSION =~ ^[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}$ ]]; then
    echo "Version ${VERSION} does not match format a.b.c"
    exit 1
fi

cd ../factorio

if [[ -e $VERSION ]]; then
    echo "Version ${VERSION} already exists"
    exit 1
fi

curl -Lfo factorio-$VERSION.tar.xz https://factorio.com/get-download/$VERSION/headless/linux64
tar -xf factorio-$VERSION.tar.xz
mv factorio $VERSION
rm factorio-$VERSION.tar.xz
