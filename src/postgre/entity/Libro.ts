import { Base } from "./Base";
import { info_libros_prestamo, info_libros_reservas } from '../../types/ConsultorEstudiante.types';
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Perfil } from "./Perfil";

@Entity()
export class Libro extends Base {

    @Column({nullable:false})
    public estado:boolean;

    @ManyToOne(()=>Perfil, (perfil)=>perfil.librosPrestamos)
    @JoinColumn({name:'perfil_prestamo_id'})
    public perfilPrestamo:Perfil

    @ManyToOne(()=>Perfil, (perfil)=>perfil.librosReservas)
    @JoinColumn({name:'perfil_reserva_id'})
    public perfilReserva:Perfil

    constructor(libroData?:info_libros_prestamo|info_libros_reservas){
        if(libroData) {
            const {libro, estado} = libroData;
            super(libro);
            this.estado = estado !== "";
            return;
        } 
        super();
    }

}