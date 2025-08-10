import postgres from "postgres";


const connection_string = process.env.DATABASE_URL;

if(!connection_string){
    throw new Error("DATABASE_URL environment variable is not defined")
}

const sql = postgres(connection_string);

export default sql;
