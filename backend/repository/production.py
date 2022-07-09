import sqlite3
import pandas as pd


def getCodMunicipio(x, municipios):
  return str(municipios[x['municipio']])

def getCodEstadoFromUF(x):
    mapaUFCod = {
        'AC': '12',
        'AL': '27',
        'AP': '16',
        'AM': '13',
        'BA': '29',
        'CE': '23',
        'DF': '53',
        'ES': '32',
        'GO': '52',
        'MA': '21',
        'MT': '51',
        'MS': '50',
        'MG': '31',
        'PA': '15',
        'PB': '25',
        'PR': '41',
        'PE': '26',
        'PI': '22',
        'RN': '24',
        'RS': '43',
        'RJ': '33',
        'RO': '11',
        'RR': '14',
        'SC': '42',
        'SP': '35',
        'SE': '28',
        'TO': '17'
    }
    return mapaUFCod[x['uf']]

def fill_db():
    con = sqlite3.connect('database.db')
    fill_production_data(con)
    fill_deforestation_data(con)
    fill_pib_data(con)
    con.close()
    print('done')

def fill_pib_data(con):
    dados = pd.read_csv('data/pibPerCapita.csv')[['sigla_uf','ano','pib','PIB per capita']]
    dados.rename(columns = {
        'sigla_uf': 'uf', 
        'ano': 'ano',
        'pib': 'pib',
        'PIB per capita': 'pib_per_capita'
    }, inplace = True)
    dados['cod_uf'] = dados.apply(getCodEstadoFromUF, axis = 1)
    dados.to_sql('pib', con=con, if_exists='replace')
    cur = con.cursor()
    cur.execute('CREATE INDEX pib_index ON pib(ano, uf, cod_uf, pib, pib_per_capita);')
    con.commit()

def fill_deforestation_data(con):
    dados = pd.read_csv('data/desmatamento_municipio.csv')[['ano','id_municipio','incremento']]
    dados.rename(columns = {
        'id_municipio': 'id_municipio', 
        'ano': 'ano',
        'incremento': 'desmatado'
    }, inplace = True)
    dados = dados.drop(dados[dados['ano'] == 2000].index)
    dados.to_sql('desmatamento', con=con, if_exists='replace')
    cur = con.cursor()
    cur.execute('CREATE INDEX desmatamento_index ON desmatamento(ano, id_municipio, desmatado);')
    con.commit()

def fill_production_data(con):
    dados = pd.read_csv('data/lavourasFinal.csv')[['Ano', 'Município', 'Produto das lavouras temporárias e permanentes', 'Área plantada ou destinada à colheita (Hectares)', 'Valor da produção (Mil Reais)', 'Área colhida (Hectares)', 'Quantidade produzida (Toneladas)']]
    dados.rename(columns = {
        'Ano': 'ano', 
        'Município': 'municipio',
        'Produto das lavouras temporárias e permanentes': 'produto',
        'Área plantada ou destinada à colheita (Hectares)': 'area_plantada',
        'Valor da produção (Mil Reais)': 'valor',
        'Área colhida (Hectares)': 'area_colhida',
        'Quantidade produzida (Toneladas)': 'quantidade'
    }, inplace = True)
    dados = dados.drop(dados[dados['produto'] == 'Total'].index)
    municipios = {}
    cidades = pd.read_csv('data/cities.csv', sep=';')[['Unidade da Federação e Município', 'Cód.']]
    for _, row in cidades.iterrows():
        municipios[row['Unidade da Federação e Município']] = row['Cód.']
    dados['cod_municipio'] = dados.apply(lambda x: getCodMunicipio(x, municipios), axis = 1)
    dados['cod_estado'] = dados['cod_municipio'].str[:2]
    dados['produto'] = dados['produto'].str.replace(r'\([^)]*\)', "", regex=True)
    dados['produto'] = dados['produto'].str.replace("*", "", regex=False)
    dados['produto'] = dados['produto'].str.strip()

    dados.to_sql('production', con=con, if_exists='replace')
    cur = con.cursor()
    cur.execute('CREATE INDEX production_index ON production(ano, municipio, produto, area_plantada, valor, area_colhida, quantidade, cod_municipio, cod_estado);')
    con.commit()

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

def getCitiesProductionValuesByProductAndState(state, product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_municipio, SUM(valor) as valor FROM production WHERE valor IS NOT NULL AND cod_estado = \'' + state + '\' AND produto = \'' + product + '\' GROUP BY ano, cod_municipio;'):
        results.append({
            'year': row[0],
            'city': row[1],
            'value': row[2]
        })
    con.close()
    return results

def getCitiesProductionQuantitiesByProductAndState(state, product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_municipio, SUM(quantidade) as quantidade FROM production WHERE quantidade IS NOT NULL AND cod_estado = \'' + state + '\' AND produto = \'' + product + '\' GROUP BY ano, cod_municipio;'):
        results.append({
            'year': row[0],
            'city': row[1],
            'quantity': row[2]
        })
    con.close()
    return results

def getCitiesProductionPlantedAreasByProductAndState(state, product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_municipio, SUM(area_plantada) as area_plantada FROM production WHERE area_plantada IS NOT NULL AND cod_estado = \'' + state + '\' AND produto = \'' + product + '\' GROUP BY ano, cod_municipio;'):
        results.append({
            'year': row[0],
            'city': row[1],
            'plantedArea': row[2]
        })
    con.close()
    return results

def getCitiesProductionLostAreasByProductAndState(state, product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_municipio, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND area_plantada IS NOT NULL AND cod_estado = \'' + state + '\' AND produto = \'' + product + '\' GROUP BY ano, cod_municipio;'):
        results.append({
            'year': row[0],
            'city': row[1],
            'lostArea': row[2]-row[3]
        })
    con.close()
    return results

def getCitiesProductionHarvestedAreasByProductAndState(state, product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_municipio, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND cod_estado = \'' + state + '\' AND produto = \'' + product + '\' GROUP BY ano, cod_municipio;'):
        results.append({
            'year': row[0],
            'city': row[1],
            'harvestedArea': row[2]
        })
    con.close()
    return results

def getStatesProductionValuesByProduct(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_estado, SUM(valor) as valor FROM production WHERE valor IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano, cod_estado;'):
        results.append({
            'year': row[0],
            'state': row[1],
            'value': row[2]
        })
    con.close()
    return results

def getStatesProductionQuantitiesByProduct(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_estado, SUM(quantidade) as quantidade FROM production WHERE quantidade IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano, cod_estado;'):
        results.append({
            'year': row[0],
            'state': row[1],
            'quantity': row[2]
        })
    con.close()
    return results

def getStatesProductionPlantedAreasByProduct(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_estado, SUM(area_plantada) as area_plantada FROM production WHERE area_plantada IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano, cod_estado;'):
        results.append({
            'year': row[0],
            'state': row[1],
            'plantedArea': row[2]
        })
    con.close()
    return results

def getStatesProductionLostAreasByProduct(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_estado, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND area_plantada IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano, cod_estado;'):
        results.append({
            'year': row[0],
            'state': row[1],
            'lostArea': row[2]-row[3]
        })
    con.close()
    return results

def getStatesProductionHarvestedAreasByProduct(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, cod_estado, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano, cod_estado;'):
        results.append({
            'year': row[0],
            'state': row[1],
            'harvestedArea': row[2]
        })
    con.close()
    return results

def getBoxplotLostArea():
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT cod_estado, cod_municipio, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND area_plantada IS NOT NULL GROUP BY ano, cod_municipio, cod_estado;'):
        results.append({
            'stateCode': row[0],
            'cityCode': row[1],
            'lostArea': row[2]-row[3]
        })
    con.close()
    return results

def getYearStateProductionValues(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT cod_estado, SUM(valor) as valor FROM production WHERE valor IS NOT NULL AND ano = \'' + year + '\' GROUP BY cod_estado;'):
        results.append({
            'state': row[0],
            'value': row[1]
        })
    con.close()
    return results

def getYearStateProductionQuantities(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT cod_estado, SUM(quantidade) as quantidade FROM production WHERE quantidade IS NOT NULL AND ano = \'' + year + '\' GROUP BY cod_estado;'):
        results.append({
            'state': row[0],
            'quantity': row[1]
        })
    con.close()
    return results

def getYearStateProductionLostAreas(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT cod_estado, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_plantada IS NOT NULL AND area_colhida IS NOT NULL AND ano = \'' + year + '\' GROUP BY cod_estado;'):
        results.append({
            'state': row[0],
            'lostArea': row[1] - row[2]
        })
    con.close()
    return results

def getYearStateProductionHarvestedAreas(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT cod_estado, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND ano = \'' + year + '\' GROUP BY cod_estado;'):
        results.append({
            'state': row[0],
            'harvestedArea': row[1]
        })
    con.close()
    return results

def getYearStateProductionPlantedAreas(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT cod_estado, SUM(area_plantada) as area_plantada FROM production WHERE area_plantada IS NOT NULL AND ano = \'' + year + '\' GROUP BY cod_estado;'):
        results.append({
            'state': row[0],
            'plantedArea': row[1]
        })
    con.close()
    return results

def getYearCityProductionValues(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT municipio, SUM(valor) as valor FROM production WHERE valor IS NOT NULL AND ano = \'' + year + '\' GROUP BY municipio;'):
        results.append({
            'city': row[0],
            'value': row[1]
        })
    con.close()
    return results

def getYearCityProductionQuantities(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT municipio, SUM(quantidade) as quantidade FROM production WHERE quantidade IS NOT NULL AND ano = \'' + year + '\' GROUP BY municipio;'):
        results.append({
            'city': row[0],
            'quantity': row[1]
        })
    con.close()
    return results

def getYearCityProductionLostAreas(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT municipio, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_plantada IS NOT NULL AND area_colhida IS NOT NULL AND ano = \'' + year + '\' GROUP BY municipio;'):
        results.append({
            'city': row[0],
            'lostArea': row[1] - row[2]
        })
    con.close()
    return results

def getYearCityProductionHarvestedAreas(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT municipio, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND ano = \'' + year + '\' GROUP BY municipio;'):
        results.append({
            'city': row[0],
            'harvestedArea': row[1]
        })
    con.close()
    return results

def getYearCityProductionPlantedAreas(year):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT municipio, SUM(area_plantada) as area_plantada FROM production WHERE area_plantada IS NOT NULL AND ano = \'' + year + '\' GROUP BY municipio;'):
        results.append({
            'city': row[0],
            'plantedArea': row[1]
        })
    con.close()
    return results

def getProductProductionValues(product):
    print(product)
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(valor) as valor FROM production WHERE valor IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'value': row[1]
        })
    con.close()
    return results

def getProductProductionQuantities(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(quantidade) as quantidade FROM production WHERE quantidade IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'quantity': row[1]
        })
    con.close()
    return results

def getProductProductionLostAreas(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_plantada IS NOT NULL AND area_colhida IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'lostArea': row[1] - row[2]
        })
    con.close()
    return results

def getProductProductionHarvestedAreas(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'harvestedArea': row[1]
        })
    con.close()
    return results

def getProductProductionPlantedAreas(product):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(area_plantada) as area_plantada FROM production WHERE area_plantada IS NOT NULL AND produto = \'' + product + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'plantedArea': row[1]
        })
    con.close()
    return results

def getStateTotalProductionValues(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(valor) as valor FROM production WHERE valor IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'value': row[1]
        })
    con.close()
    return results

def getStateTotalProductionQuantities(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(quantidade) as quantidade FROM production WHERE quantidade IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'quantity': row[1]
        })
    con.close()
    return results

def getStateTotalProductionPlantedAreas(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(area_plantada) as area_plantada FROM production WHERE area_plantada IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'plantedArea': row[1]
        })
    con.close()
    return results

def getStateTotalProductionLostAreas(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(area_plantada) as area_plantada, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND area_plantada IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'lostArea': row[1]-row[2]
        })
    con.close()
    return results

def getStateTotalProductionHarvestedAreas(state):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('SELECT ano, SUM(area_colhida) as area_colhida FROM production WHERE area_colhida IS NOT NULL AND cod_estado = \'' + state + '\' GROUP BY ano;'):
        results.append({
            'year': row[0],
            'harvestedArea': row[1]
        })
    con.close()
    return results

def getCorrelationDeflorestationQuantity():
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('''SELECT production.ano, SUM(production.quantidade) as quantidade, SUM(desmatamento.desmatado) as desmatado, production.municipio
                                FROM production 
                                INNER JOIN desmatamento ON production.ano = desmatamento.ano AND production.cod_municipio = desmatamento.id_municipio
                                WHERE production.quantidade IS NOT NULL GROUP BY production.ano, production.municipio;'''):
        results.append({
            'year': row[0],
            'city': row[3],
            'quantity': row[1],
            'destroyed': row[2]
        })
    con.close()
    return results

def getCorrelationPibValue():
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    results = []
    for row in cur.execute('''SELECT production.ano, pib.uf, SUM(production.valor) as valor, pib.pib as pib, pib.pib_per_capita as pib_per_capita
                                FROM production 
                                INNER JOIN pib ON production.ano = pib.ano AND production.cod_estado = pib.cod_uf
                                WHERE production.valor IS NOT NULL GROUP BY production.ano, pib.uf;'''):
        results.append({
            'year': row[0],
            'uf': row[1],
            'value': row[2],
            'pib': row[3],
            'pib_per_capita': row[4]
        })
    con.close()
    return results
