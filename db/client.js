const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://maorgo92@localhost:5432/inventory_app",
});

const SQL = `
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        product_name VARCHAR ( 255 ),
        category VARCHAR ( 255 ),
        price NUMERIC(5, 2),
        quantity INTEGER
    );

    INSERT INTO inventory (product_name ,category ,price ,quantity)
    VALUES
        ('banana' ,'fruits' ,4.00 ,3),
        ('milk' ,'dairy' ,2.55 ,10),
        ('beans' ,'lentils' ,3.15 ,3);
    
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        category VARCHAR ( 255 )
    );

    INSERT INTO categories (category)
    VALUES 
        ('fruits'),
        ('dairy'),
        ('lentils');
`;

async function main() {
    console.log("initiating table..")
    await client.connect()
    console.log("connection established...")
    await client.query(SQL);
    console.log("table created")
    await client.end();
    console.log("done")
};

main();