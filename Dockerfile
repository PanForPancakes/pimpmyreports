FROM python:3.10-alpine
WORKDIR /service

COPY service.py ./

CMD [ "python", "service.py" ]