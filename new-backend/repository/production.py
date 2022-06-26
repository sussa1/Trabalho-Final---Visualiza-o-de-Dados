import sqlite3
import pandas as pd


def getCodMunicipio(x, municipios):
  return str(municipios[x['municipio']])

def fill_db():
    con = sqlite3.connect('database.db')
    dados = pd.read_csv('data/dados.csv')[['ano', 'municipio', 'produto', 'area_plantada', 'valor', 'area_colhida', 'quantidade']]
    municipios = {}
    cidades = pd.read_csv('data/cities.csv', sep=';')[['Unidade da Federação e Município', 'Cód.']]
    for index, row in cidades.iterrows():
        municipios[row['Unidade da Federação e Município']] = row['Cód.']
    dados['cod_municipio'] = dados.apply(lambda x: getCodMunicipio(x, municipios), axis = 1)
    dados['cod_estado'] = dados['cod_municipio'].str[:2]
    dados.to_sql('production', con=con, if_exists='replace')
    cur = con.cursor()
    cur.execute('CREATE INDEX production_index ON production(ano, municipio, produto, area_plantada, valor, area_colhida, quantidade, cod_municipio, cod_estado);')
    con.commit()
    con.close()
    print('done')

def fill_db_new_data():
    con = sqlite3.connect('database.db')
    dados = pd.read_csv('data/lavouras_final.csv')[['Ano', 'Município', 'Produto das lavouras temporárias e permanentes', 'Área plantada ou destinada à colheita (Hectares)', 'Valor da produção (Mil Reais)', 'Área colhida (Hectares)', 'Quantidade produzida (Toneladas)']]
    dados.rename(columns = {
        'Ano': 'ano', 
        'Município': 'municipio',
        'Produto das lavouras temporárias e permanentes': 'produto',
        'Área plantada ou destinada à colheita (Hectares)': 'area_plantada',
        'Valor da produção (Mil Reais)': 'valor',
        'Área colhida (Hectares)': 'area_colhida',
        'Quantidade produzida (Toneladas)': 'quantidade'
    }, inplace = True)
    municipios = {}
    cidades = pd.read_csv('data/cities.csv', sep=';')[['Unidade da Federação e Município', 'Cód.']]
    for index, row in cidades.iterrows():
        municipios[row['Unidade da Federação e Município']] = row['Cód.']
    dados['cod_municipio'] = dados.apply(lambda x: getCodMunicipio(x, municipios), axis = 1)
    dados['cod_estado'] = dados['cod_municipio'].str[:2]
    dados.to_sql('production', con=con, if_exists='replace')
    cur = con.cursor()
    cur.execute('CREATE INDEX production_index ON production(ano, municipio, produto, area_plantada, valor, area_colhida, quantidade, cod_municipio, cod_estado);')
    con.commit()
    con.close()
    print('done')

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

def getTotalProductionValueByProduct():
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(valor) as valor FROM production WHERE valor IS NOT NULL GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'value': row[2]
        })
    con.close()
    return results

def getTotalProductionQuantityByProduct():
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(quantidade) as quantidade FROM production WHERE quantidade IS NOT NULL GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'quantity': row[2]
        })
    con.close()
    return results

def getTotalProductionPlantedAreaByProduct():
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(area_plantada) as area_plantada FROM production WHERE area_plantada IS NOT NULL GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'plantedArea': row[2]
        })
    con.close()
    return results

def getTotalProductionLostAreaByYear(year):
    pass

def getTotalProductionLostAreaByProduct():
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND area_plantada IS NOT NULL GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'lostArea': row[2]-row[3]
        })
    con.close()
    return results

def getTotalProductionHarvestedAreaByProduct():
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'harvestedArea': row[2]
        })
    con.close()
    return results

def getTotalProductionValueByProductAndState(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(valor) as valor FROM production WHERE valor IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'value': row[2]
        })
    con.close()
    return results

def getTotalProductionQuantityByProductAndState(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(quantidade) as quantidade FROM production WHERE quantidade IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'quantity': row[2]
        })
    con.close()
    return results

def getTotalProductionPlantedAreaByProductAndState(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(area_plantada) as area_plantada FROM production WHERE area_plantada IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'plantedArea': row[2]
        })
    con.close()
    return results

def getTotalProductionLostAreaByProductAndState(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND area_plantada IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'lostArea': row[2]-row[3]
        })
    con.close()
    return results

def getTotalProductionHarvestedAreaByProductAndState(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, produto, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano, produto;'):
        results.append({
            'year': row[0],
            'product': row[1],
            'harvestedArea': row[2]
        })
    con.close()
    return results