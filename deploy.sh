#!/bin/sh

cd $1
git pull origin master

thin stop -C todo.yml
thin start -C todo.yml