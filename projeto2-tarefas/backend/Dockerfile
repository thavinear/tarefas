# ---------- ETAPA 1: build ----------
FROM eclipse-temurin:25-jdk AS build

WORKDIR /app

# Instala ferramentas para baixar e descompactar o Gradle
RUN apt-get update \
	&& apt-get install -y --no-install-recommends wget unzip ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

ENV GRADLE_VERSION=9.7.1
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -O /tmp/gradle.zip \
	&& unzip /tmp/gradle.zip -d /opt \
	&& ln -s /opt/gradle-${GRADLE_VERSION}/bin/gradle /usr/bin/gradle \
	&& rm /tmp/gradle.zip

COPY build.gradle settings.gradle* ./
COPY src ./src

RUN gradle clean bootJar -x test --no-daemon

# ---------- ETAPA 2: run ----------
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
