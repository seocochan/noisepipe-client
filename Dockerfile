FROM nginx:stable

RUN rm -rf /etc/nginx/conf.d
COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY ./build/ /usr/share/nginx/html