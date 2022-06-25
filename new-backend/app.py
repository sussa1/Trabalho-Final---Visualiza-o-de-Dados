from flask import Flask, jsonify, request

from services import production
from flask_cors import CORS

from repository import production as production_repo

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

@app.route('/state/value', methods=['GET'])
def getTotalProductionValueState():
    state = request.args.get('state')
    return jsonify(production.getTotalProductionValueByProductAndState(state))

@app.route('/state/quantity', methods=['GET'])
def getTotalProductionQuantityState():
    state = request.args.get('state')
    return jsonify(production.getTotalProductionQuantityByProductAndState(state))

@app.route('/state/plantedArea', methods=['GET'])
def getTotalProductionPlantedAreaState():
    state = request.args.get('state')
    return jsonify(production.getTotalProductionPlantedAreaByProductAndState(state))

@app.route('/state/harvestedArea', methods=['GET'])
def getTotalProductionHarvestedAreaState():
    state = request.args.get('state')
    return jsonify(production.getTotalProductionHarvestedAreaByProductAndState(state))

@app.route('/state/lostArea', methods=['GET'])
def getTotalProductionLostAreaState():
    state = request.args.get('state')
    return jsonify(production.getTotalProductionLostAreaByProductAndState(state))

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)