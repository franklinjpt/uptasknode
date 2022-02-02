import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from '../funciones/avance';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', e =>{
        const urlProyecto = e.target.dataset.proyectoUrl;

        console.log(location.pathname);
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
                // sending request axios
                const url = `${location.origin}${location.pathname}`;

                axios.delete(url, {params: {urlProyecto}})
                    .then(function(response){
                        console.log(response);
                    
                            Swal.fire(
                                'Deleted!',
                                response.data,
                                'success'
                            );

                            actualizarAvance();
                
                            setTimeout(() => {
                            window.location.href = '/'
                            }, 3000);
                    })
                    .catch((error) => {
                        console.log(error);
                        Swal.fire(
                            'There was an error',
                            'The project couldn\'t be deleted',
                            'error'
                        );                       
                    })                    
            }
          })
    })
}

export default btnEliminar;