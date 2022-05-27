with open('cities - Copia.csv', 'r', encoding="utf8") as infile, open('cities.csv', 'w', encoding="utf8") as outfile:
    temp = infile.read().replace("\"", "")
    outfile.write(temp)

for i in range(1974, 2021):
    with open(str(i) + ' - Copia.csv', 'r', encoding="utf8") as infile, open(str(i) + '-temp.csv', 'w', encoding="utf8") as outfile:
        temp = infile.read().replace("\"", "")
        outfile.write(temp)

for i in range(1974, 2021):
    lines = []
    with open(str(i) + '-temp.csv', encoding="utf8") as f1:
        lines = f1.readlines()
    with open(str(i) + '.csv', "w", encoding="utf8") as f2:
        f2.writelines(lines[:-35])
