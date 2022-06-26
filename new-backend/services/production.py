
from repository import production

def getStateProductionValues(stateCode):
    pass

def getYearStateProductionValues(year):
    pass

def getStateProductionQuantities(stateCode):
    pass

def getStateProductionPlantedArea(stateCode):
    pass

def getStateProductionLostArea(stateCode):
    pass

def getStateProductionHarvestedArea(stateCode):
    pass

def getTotalProductionLostAreaByYear(year):
    pass

def getTotalProductionValueByProduct():
    return production.getTotalProductionValueByProduct()

def getTotalProductionQuantityByProduct():
    return production.getTotalProductionQuantityByProduct()

def getTotalProductionPlantedAreaByProduct():
    return production.getTotalProductionPlantedAreaByProduct()

def getTotalProductionLostAreaByProduct():
    return production.getTotalProductionLostAreaByProduct()

def getTotalProductionHarvestedAreaByProduct():
    return production.getTotalProductionHarvestedAreaByProduct()

def getTotalProductionValueByProductAndState(state):
    return production.getTotalProductionValueByProductAndState(state)

def getTotalProductionQuantityByProductAndState(state):
    return production.getTotalProductionQuantityByProductAndState(state)

def getTotalProductionPlantedAreaByProductAndState(state):
    return production.getTotalProductionPlantedAreaByProductAndState(state)

def getTotalProductionLostAreaByProductAndState(state):
    return production.getTotalProductionLostAreaByProductAndState(state)

def getTotalProductionHarvestedAreaByProductAndState(state):
    return production.getTotalProductionHarvestedAreaByProductAndState(state)

def getCitiesProductionValuesByProductAndState(state, product):
    return production.getCitiesProductionValuesByProductAndState(state, product)

def getCitiesProductionQuantitiesByProductAndState(state, product):
    return production.getCitiesProductionQuantitiesByProductAndState(state, product)

def getCitiesProductionPlantedAreasByProductAndState(state, product):
    return production.getCitiesProductionPlantedAreasByProductAndState(state, product)

def getCitiesProductionLostAreasByProductAndState(state, product):
    return production.getCitiesProductionLostAreasByProductAndState(state, product)

def getCitiesProductionHarvestedAreasByProductAndState(state, product):
    return production.getCitiesProductionHarvestedAreasByProductAndState(state, product)