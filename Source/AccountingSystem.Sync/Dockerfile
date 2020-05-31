FROM ubuntu

RUN apt-get update
RUN apt-get -y install cron
RUN apt-get -y install nano

RUN echo "dash dash/sh boolean false" | debconf-set-selections
RUN DEBIAN_FRONTEND=noninteractive dpkg-reconfigure dash

WORKDIR /app

COPY ["./mongo-shake-v2.2.1.tar.gz", "/app"]
RUN tar zxvf mongo-shake-v2.2.1.tar.gz

RUN cp -r /app/mongo-shake-v2.2.1/. /app

RUN rm -rf /app/mongo-shake-v2.2.1
RUN rm -rf /app/mongo-shake-v2.2.1.tar.gz

RUN (crontab -l ; echo "*/5 * * * * sh /app/start.sh /app/collector.conf")| crontab -

CMD ["cron", "-f", "&&", "service", "cron", "start"]





