FROM eclipse-temurin:8-jre

LABEL maintainer="wjtd" \
      org.opencontainers.image.title="WJTD Official Website" \
      org.opencontainers.image.description="万嘉通达官网"

WORKDIR /app

ENV TZ=Asia/Shanghai \
    JAVA_OPTS="-Xms512m -Xmx1024m -Dfile.encoding=UTF-8 -Duser.timezone=Asia/Shanghai -Djava.security.egd=file:/dev/./urandom"

COPY app.jar /app/app.jar
COPY htmls/ /app/htmls-default/

RUN mkdir -p /app/htmls /app/upload /app/plugins /app/lucene /app/logs

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "if [ ! -f /app/htmls/cms/_template.properties ]; then echo 'initializing /app/htmls from /app/htmls-default' >&2; cp -a /app/htmls-default/. /app/htmls/; fi; test -f /app/htmls/cms/_template.properties || { echo 'ERROR: /app/htmls/cms not found' >&2; exit 1; }; exec java $JAVA_OPTS -jar /app/app.jar --spring.profiles.active=prod"]
