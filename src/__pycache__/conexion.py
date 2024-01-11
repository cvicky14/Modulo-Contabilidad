import pyodbc

connection_stringOracle = ('DRIVER={Oracle en OraDB21Home1};SERVER=192.168.56.1:1521/xe;UID=crud_conta;PWD=crud1234')
connOracle = pyodbc.connect(connection_stringOracle)
