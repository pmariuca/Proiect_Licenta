from face_recognition.script import verify_identity
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/authenticate/verifyIdentity', methods=['POST'])
def handle_image():
    username = request.form.get('username') + '.jpeg'
    image = request.files.get('image')

    if username and image:
        result = verify_identity(username, image)

        return jsonify(result), 200
    else:
        return jsonify(error='No image provided'), 400


@app.route('/')
def index():
    return 'Server is running on port 5000'


if __name__ == '__main__':
    app.run(port=5000)
