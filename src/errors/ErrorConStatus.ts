
export default interface ErrorConStatus extends Error{
    status?:number, 
    errorCode?:string
}