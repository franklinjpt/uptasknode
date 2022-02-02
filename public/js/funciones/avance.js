import Swal from "sweetalert2";

export const actualizarAvance = () => {
    //seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length){
    //seleccionar tareas completadas
    const tareasCompletas = document.querySelectorAll('i.completo');

    //calcular el avance
    const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

    //mostrar avance
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    if(avance === 100){
        Swal.fire(
            'Congratulations!!',
            'You have completed all your tasks',
            'success'
        )
    }

    }


    

}