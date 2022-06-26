from flask import Flask, jsonify, request

from services import production
from flask_cors import CORS

from repository import production as production_repo

#production_repo.fill_db()

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

@app.route('/cities/value', methods=['GET'])
def getCitiesProductionValueState():
    state = request.args.get('state')
    product = request.args.get('product')
    return jsonify(production.getCitiesProductionValuesByProductAndState(state, product))

@app.route('/cities/quantity', methods=['GET'])
def getCitiesProductionQuantityState():
    state = request.args.get('state')
    product = request.args.get('product')
    return jsonify(production.getCitiesProductionQuantitiesByProductAndState(state, product))

@app.route('/cities/plantedArea', methods=['GET'])
def getCitiesProductionPlantedAreaState():
    state = request.args.get('state')
    product = request.args.get('product')
    return jsonify(production.getCitiesProductionPlantedAreasByProductAndState(state, product))

@app.route('/cities/harvestedArea', methods=['GET'])
def getCitiesProductionHarvestedAreaState():
    state = request.args.get('state')
    product = request.args.get('product')
    return jsonify(production.getCitiesProductionHarvestedAreasByProductAndState(state, product))

@app.route('/cities/lostArea', methods=['GET'])
def getCitiesProductionLostAreaState():
    state = request.args.get('state')
    product = request.args.get('product')
    return jsonify(production.getCitiesProductionLostAreasByProductAndState(state, product))

@app.route('/states/value', methods=['GET'])
def getStatesProductionValueState():
    product = request.args.get('product')
    return jsonify(production.getStatesProductionValuesByProduct(product))

@app.route('/states/quantity', methods=['GET'])
def getStatesProductionQuantityState():
    product = request.args.get('product')
    return jsonify(production.getStatesProductionQuantitiesByProduct(product))

@app.route('/states/plantedArea', methods=['GET'])
def getStatesProductionPlantedAreaState():
    product = request.args.get('product')
    return jsonify(production.getStatesProductionPlantedAreasByProduct(product))

@app.route('/states/harvestedArea', methods=['GET'])
def getStatesProductionHarvestedAreaState():
    product = request.args.get('product')
    return jsonify(production.getStatesProductionHarvestedAreasByProduct(product))

@app.route('/states/lostArea', methods=['GET'])
def getStatesProductionLostAreaState():
    product = request.args.get('product')
    return jsonify(production.getStatesProductionLostAreasByProduct(product))

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)