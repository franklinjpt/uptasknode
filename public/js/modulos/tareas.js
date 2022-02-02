import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from '../funciones/avance';


const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function(response){
                    if(response.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
            }).then((result) => {            
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    
                    axios.delete(url, { params: {idTarea}})
                        .then(function(response){
                            if(response.status === 200){
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                Swal.fire(
                                    'Task Deleted',
                                    response.data,
                                    'success'
                                )

                                actualizarAvance();
                            }
                        })
                }
            })
        }
    });
}

export default tareas;
