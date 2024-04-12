import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import storage, credentials
import cv2
import numpy as np
from deepface import DeepFace

load_dotenv()

firebase_credentials = credentials.Certificate('D:\\Learning\\Proiect_Licenta\\backend-js\\licenta-de643-firebase-adminsdk-mcjcm-15715bb87c.json')
application = firebase_admin.initialize_app(firebase_credentials, {
    'storageBucket': os.getenv('FIREBASE_BUCKET')
})
bucket = storage.bucket()


def verify_identity(username, image):
    blob = bucket.get_blob(username)
    array = np.frombuffer(blob.download_as_string(), np.uint8)
    input_image = cv2.imdecode(array, cv2.IMREAD_COLOR)

    filestr = image.read()
    npimg = np.fromstring(filestr, np.uint8)
    live_image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    result = DeepFace.verify(img1_path=input_image, img2_path=live_image, model_name='Facenet')
    return result
