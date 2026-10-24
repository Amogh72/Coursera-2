FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p /usr/local/share/nltk_data/sentiment \
    && cp sentiment/vader_lexicon.zip /usr/local/share/nltk_data/sentiment/vader_lexicon.zip
ENV NLTK_DATA=/usr/local/share/nltk_data
ENV FLASK_APP=app.py
EXPOSE 5050
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5050"]
