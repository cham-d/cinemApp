FROM ubuntu:18.04

MAINTAINER hbeadles

ARG BASE_DIR=/var/www
ARG WEBSITE_NAME=test0aouth2_django
ENV WEBSITE_NAME=${WEBSITE_NAME}

# Add apache2, mod_wsgi, python3.6 libraries
RUN apt-get update && apt-get install -y apache2 \
    libapache2-mod-wsgi-py3 \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3.6-dev \
    python3.6 \
    python3.6-venv \
    python3-pip \
    vim \
    sudo \
    && apt-get clean \
    && apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*
RUN sudo apt-get update

RUN apt-get install python3-dev default-libmysqlclient-dev gcc  -y #shmantiko gia na leitoyrghsei mysqlclient
EXPOSE 80
# Make directory for base_site
RUN mkdir ${BASE_DIR}/${WEBSITE_NAME}
ENTRYPOINT ["/bin/bash", "/var/www/startup.sh"]
