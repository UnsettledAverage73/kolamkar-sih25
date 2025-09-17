from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
from kolampython import generate_kolam_image # Corrected import

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/generate-kolam', methods=['POST'])
def generate_kolam():
    data = request.get_json()
    
    axiom = data.get("axiom", "FBFBFBFB")
    rules = data.get("rules", {"A": "AFBFA", "B": "AFBFBFBFA"})
    angle = data.get("angle", 45)
    dot_size = data.get("dot_size", 10)
    iterations = data.get("iterations", 2)
    
    try:
        png_data = generate_kolam_image(axiom, rules, angle, dot_size, iterations)
        encoded_image = base64.b64encode(png_data).decode('utf-8')
        return jsonify({"image": encoded_image}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
