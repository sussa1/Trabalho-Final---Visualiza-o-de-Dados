
from repository import production

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

def getStatesProductionValuesByProduct(product):
    return production.getStatesProductionValuesByProduct(product)

def getStatesProductionQuantitiesByProduct(product):
    return production.getStatesProductionQuantitiesByProduct(product)

def getStatesProductionPlantedAreasByProduct(product):
    return production.getStatesProductionPlantedAreasByProduct(product)

def getStatesProductionLostAreasByProduct(product):
    return production.getStatesProductionLostAreasByProduct(product)

def getStatesProductionHarvestedAreasByProduct(product):
    return production.getStatesProductionHarvestedAreasByProduct(product)

def getBoxplotLostArea():
    return production.getBoxplotLostArea()

def getYearStateProductionValues(year):
    return production.getYearStateProductionValues(year)

def getYearStateProductionQuantities(year):
    return production.getYearStateProductionQuantities(year)

def getYearStateProductionLostAreas(year):
    return production.getYearStateProductionLostAreas(year)

def getYearStateProductionHarvestedAreas(year):
    return production.getYearStateProductionHarvestedAreas(year)

def getYearStateProductionPlantedAreas(year):
    return production.getYearStateProductionPlantedAreas(year)

def getYearCityProductionValues(year):
    return production.getYearCityProductionValues(year)

def getYearCityProductionQuantities(year):
    return production.getYearCityProductionQuantities(year)

def getYearCityProductionLostAreas(year):
    return production.getYearCityProductionLostAreas(year)

def getYearCityProductionHarvestedAreas(year):
    return production.getYearCityProductionHarvestedAreas(year)

def getYearCityProductionPlantedAreas(year):
    return production.getYearCityProductionPlantedAreas(year)