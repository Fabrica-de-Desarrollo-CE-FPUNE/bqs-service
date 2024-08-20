import fs from 'fs';
export function read_File(path:string):string {
    try{
        return fs.readFileSync(path, 'utf-8');
    }catch(error){
        console.log(error);
        return "";
    }
}

export function write_file(path:string, content:string):void{
    try{
        fs.writeFileSync(path, content);
    }catch(error){
        console.log(error);
    }
}

export function parse_json(path:string){
    try{
        return JSON.parse(read_File(path));
    }catch(error){
        console.log((error as Error).message);
    }  
}