import { getMateria } from "../../src/utils/dataUtil";

describe('Conjunto de test para los utils', ()=>{
    
    it('Prueba de util de getMateria', ()=>{
        const materia = getMateria('7421 GESTION EMPRESARIAL TIC. Sem.: 8')
        expect(materia).toStrictEqual({
            id: 7421,
            nombre:'GESTION EMPRESARIAL TIC',
            semestre:8
        })
    });
})