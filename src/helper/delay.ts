export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export function capitalizedString(str: string){
    return str.charAt(0).toUpperCase() + str.slice(1)
}