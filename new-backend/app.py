from flask import Flask, jsonify

from services import production
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/value', methods=['GET'])
def getTotalProductionValue():
    return jsonify(production.getTotalProductionValueByProduct())

@app.route('/quantity', methods=['GET'])
def getTotalProductionQuantity():
    return jsonify(production.getTotalProductionQuantityByProduct())

@app.route('/plantedArea', methods=['GET'])
def getTotalProductionPlantedArea():
    return jsonify(production.getTotalProductionPlantedAreaByProduct())

@app.route('/harvestedArea', methods=['GET'])
def getTotalProductionHarvestedArea():
    return jsonify(production.getTotalProductionHarvestedAreaByProduct())

@app.route('/lostArea', methods=['GET'])
def getTotalProductionLostArea():
    return jsonify(production.getTotalProductionLostAreaByProduct())
