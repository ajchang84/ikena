from flask import Flask, request, redirect, url_for, render_template

app = Flask(__name__)

# INDEX

@app.route('/', methods=["GET"])
def index():
  return render_template('index.html')

if __name__ == '__main__':
  app.run(debug=True, port=3000)