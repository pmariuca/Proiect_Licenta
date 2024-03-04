from flask import Flask

app = Flask(__name__)


@app.route('/')
def index():
    return 'Server is running on port 3001'


if __name__ == '__main__':
    app.run(port=4001)
